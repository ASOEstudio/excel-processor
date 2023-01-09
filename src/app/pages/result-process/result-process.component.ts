import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  AuxiliaryService,
  SheetMatch,
} from 'src/app/services/auxiliary.service';

import { MatTable } from '@angular/material/table';
import { DOCUMENT } from '@angular/common';

import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-result-process',
  templateUrl: './result-process.component.html',
  styleUrls: ['./result-process.component.scss'],
})
export class ResultProcessComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('table') table: MatTable<any>;

  public result: ExploreResult[];
  protected resultBackup: ExploreResult[];

  public columnsLabel: string[];
  public tabIndex = 0;
  public liberadosAll = false;

  downloadIcon = faDownload;

  constructor(
    private auxiliary: AuxiliaryService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.auxiliary.result$.subscribe((res) => {
      if (!res[0]) {
        this.router.navigate(['/']);
      } else {
        this.exploreData(res);
      }
    });
  }

  ngOnInit(): void {
    this.columnsLabel = Object.keys(this.result[0].dataNf[0]);
  }

  ngAfterViewInit(): void {
    this.defineTabBodyHeight();
  }

  ngOnDestroy(): void {
    this.auxiliary.removeResults();
  }

  exploreData(data: SheetMatch[]): void {
    const result: ExploreResult[] = JSON.parse(JSON.stringify(data));
    result.forEach((cad) => {
      let totalValue = 0;
      let cont = 0;
      cad.dataNf
        .filter((nota) => nota.credito > 0)
        .forEach((nota) => {
          totalValue += nota.credito;
          ++cont;
        });
      cad.totalValue = totalValue;
      cad.notaWithValue = cont;
      cad.numNotas = cad.dataNf.length;
    });
    this.resultBackup = JSON.parse(JSON.stringify(result));
    this.result = result;
  }

  defineTabBodyHeight(): void {
    let tabBody: HTMLDivElement = this.document.body.querySelector(
      '.mat-tab-body-wrapper'
    );
    setInterval(() => {
      if (!tabBody.style.height) {
        const pageBack =
          this.document.body.querySelector('app-page-back').clientHeight;
        const card = this.document.body.querySelector('mat-card').clientHeight;
        const tabHeader =
          this.document.body.querySelector('mat-tab-header').clientHeight;
        tabBody = this.document.body.querySelector('.mat-tab-body-wrapper');
        const margin = (2 + 2) * 16;
        const sum = `height: calc(100vh - ${
          pageBack + card + tabHeader + margin
        }px)`.toLowerCase();
        tabBody.setAttribute('style', sum);
      }
    }, 500);
  }

  exportTable(): void {
    this.auxiliary.exportFile(this.result[this.tabIndex]);
  }
}

export interface ExploreResult extends SheetMatch {
  totalValue: number;
  numNotas: number;
  notaWithValue: number;
}
