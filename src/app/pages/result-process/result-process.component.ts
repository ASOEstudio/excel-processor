import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuxiliaryService,
  DataNf,
  SheetMatch,
} from 'src/app/services/auxiliary.service';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

@Component({
  selector: 'app-result-process',
  templateUrl: './result-process.component.html',
  styleUrls: ['./result-process.component.scss'],
})
export class ResultProcessComponent implements OnDestroy {
  protected subscription
  public result: ExploreResult[];
  public loaded = false;

  public columnsLabel: string[];
  public tabIndex = 0;
  public liberadosAll = false;

  downloadIcon = faDownload;

  constructor(private auxiliary: AuxiliaryService, private router: Router) {
    this.subscription = this.auxiliary.result$.subscribe((res) => {
      if (!res[0]) {
        this.router.navigate(['/']);
      } else {
        this.columnsLabel = Object.keys(res[0].dataNf[0]);
        this.exploreData(res).then((data) => {
          this.loaded = true;
          this.result = data;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  exploreData(data: SheetMatch[]): Promise<ExploreResult[]> {
    this.loaded = false;
    const promise = new Promise<ExploreResult[]>((resolve) => {
      const result: ExploreResult[] = (
        this.copyJSON(data) as SheetMatch[]
      ).map((cad) => {
        const notasWithValue = cad.dataNf.filter((nota) => nota.credito > 0);

        return {
          cpf: cad.cpf,
          dataNf: cad.dataNf,
          numNotas: cad.dataNf.length,
          notaWithValue: notasWithValue.length,
          totalValue: notasWithValue.reduce(
            (acc, nota) => acc + nota.credito,
            0
          ),
          dataSource: new TableVirtualScrollDataSource<DataNf>(cad.dataNf),
        };
      });
      resolve(result);
    });
    return promise;
  }

  exportTable(): void {
    this.auxiliary.exportFileCpf(this.result[this.tabIndex]);
  }

  copyJSON(data: any) {
    return JSON.parse(JSON.stringify(data));
  }
}

export interface ExploreResult extends SheetMatch {
  totalValue: number;
  numNotas: number;
  notaWithValue: number;
  dataSource?: unknown;
}
