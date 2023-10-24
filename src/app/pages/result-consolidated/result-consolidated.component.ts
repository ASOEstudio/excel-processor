import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuxiliaryService,
  SheetMatch,
} from 'src/app/services/auxiliary.service';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result-consolidated',
  templateUrl: './result-consolidated.component.html',
  styleUrls: ['./result-consolidated.component.scss'],
})
export class ResultConsolidatedComponent implements OnDestroy {
  protected subscription: Subscription;
  public result: ExploreResultConsolidated;
  public loaded = false;

  public columnsLabel: string[];
  public tabIndex = 0;
  public liberadosAll = false;

  cashbackFee = 10;

  downloadIcon = faDownload;

  copyJSON = this.auxiliary.copyJSON;

  constructor(private auxiliary: AuxiliaryService, private router: Router) {
    this.subscription = this.auxiliary.result$.subscribe((res) => {
      if (!res[0]) {
        this.router.navigate(['/']);
      } else {
        this.exploreData(res).then((data) => {
          this.columnsLabel = Object.keys(data.tableData[0]);
          this.result = data;
          this.loaded = true;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  exploreData(data: SheetMatch[]): Promise<ExploreResultConsolidated> {
    this.loaded = false;
    const tableData: TableDataItem[] = this.copyJSON(data).map((cad) => {
      const sumValues = cad.dataNf.reduce((acc, nota) => acc + nota.credito, 0);
      return {
        cpf: cad.cpf,
        sumValues,
        cashback: (sumValues * this.cashbackFee) / 100,
      };
    });
    const notasLiberadas = tableData.find(
      (item) => item.cpf === 'notas liberadas'
    );
    const result: ExploreResultConsolidated = {
      tableData,
      explore: {
        totalValue: notasLiberadas.sumValues,
        cashbackTotal: notasLiberadas.cashback,
        numCpf: tableData.length - 2,
      },
      dataSource: new TableVirtualScrollDataSource<TableDataItem>(tableData),
    };
    return Promise.resolve(result);
  }

  exportTable(): void {
    this.auxiliary.exportFileConsolidated(this.result);
  }

  recalculate(value: string): void {
    if (value) {
      this.cashbackFee = +value;
      this.auxiliary.setSnackbar('percentual de cashback recalculando');
      let { tableData, dataSource, explore } = this.result;
      tableData.forEach(
        (item) => (item.cashback = (item.sumValues * this.cashbackFee) / 100)
      );
      dataSource = new TableVirtualScrollDataSource<TableDataItem>(tableData);
      explore.cashbackTotal = tableData.find(
        (i) => i.cpf === 'notas liberadas'
      ).cashback;
    }
  }

  replace(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value && +input.value > 100 && (input.value = '100');
  }
}

interface TableDataItem {
  cpf: string;
  sumValues: number;
  cashback: number;
}

export interface ExploreResultConsolidated {
  tableData: TableDataItem[];
  explore?: { totalValue: number; cashbackTotal: number; numCpf: number };
  dataSource?: unknown;
}
