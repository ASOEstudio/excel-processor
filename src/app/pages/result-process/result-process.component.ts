import { Component, OnInit, OnDestroy, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuxiliaryService, SheetMatch } from 'src/app/services/auxiliary.service';

import { faSort, faSortNumericUpAlt, faSortNumericDown } from '@fortawesome/free-solid-svg-icons';
import { MatTable } from '@angular/material/table';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-result-process',
  templateUrl: './result-process.component.html',
  styleUrls: ['./result-process.component.scss']
})
export class ResultProcessComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('table') table: MatTable<any>;

  public result: ExploreResult[];
  protected resultBackup: ExploreResult[];

  public columnsLabel: string[];
  public tabIndex = 0;

  // public sortCredito: null | 'big' | 'small' = 'small';

  // icons
  // sortIcon = faSort;
  // sortBigIcon = faSortNumericUpAlt;
  // sortSmallIcon = faSortNumericDown;

  public liberadosAll = false;

  constructor(
    private auxiliary: AuxiliaryService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.auxiliary.result$.subscribe(res => { if (!res[0]) { this.router.navigate(['/']); } else { this.exploreData(res); } });
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
    result.forEach( cad => {
      let totalValue = 0;
      let cont = 0;
      cad.dataNf.filter(nota => nota.credito > 0).forEach(nota => {totalValue += nota.credito; ++cont; });
      cad.totalValue = totalValue;
      cad.notaWithValue = cont;
      cad.numNotas = cad.dataNf.length;
    });
    this.resultBackup = JSON.parse(JSON.stringify(result));
    this.result = result;
    // this.sortLiberados();
  }

  defineTabBodyHeight(): void {
    setTimeout(() => {
      const pageBack = this.document.body.querySelector('app-page-back').clientHeight;
      const card = this.document.body.querySelector('mat-card').clientHeight;
      const tabHeader = this.document.body.querySelector('mat-tab-header').clientHeight;
      const tabBody = this.document.body.querySelector('.mat-tab-body-wrapper');
      const margin = (2 + 2) * 16;
      const sum = `height: calc(100vh - ${pageBack + card + tabHeader + margin}px)`.toLowerCase();
      tabBody.setAttribute('style', sum);
    }, 300);
  }

  // customScroll(): void {
  //   const tabBodyContent = this.document.body.querySelector('.mat-tab-body-content');
  //   tabBodyContent.classList.add('ep-custom-scroll');
  // }

  // sortLiberados(index?: number): void {
  //   if (typeof index === 'number') { this.result.find( item => item.cpf === 'notas liberadas').dataNf.splice(index, 1); }
  //   this.result.find( item => item.cpf === 'notas liberadas').dataNf
  //     .forEach( (line, i) => { if (line.credito === 0) { this.sortLiberados(i); } else { return; } });
  // }

  // sortCreditoButton(): void {
  //   if (this.sortCredito === null) { this.sortCredito = 'big';
  //   } else if (this.sortCredito === 'big') { this.sortCredito = 'small';
  //   } else if (this.sortCredito === 'small') { this.sortCredito = null; }
  //   this.sortResult();
  // }

  // sortResult(): void {
  //   if (this.sortCredito === null) {
  //     this.result = this.resultBackup;
  //   } else if (this.sortCredito === 'big') {
  //     this.result.forEach( cad => {
  //       cad.dataNf.sort( (a, b) => {
  //         if (a.credito < b.credito) { return 1; }
  //         if (a.credito > b.credito) { return -1; }
  //         return 0;
  //       });
  //     });
  //   } else if (this.sortCredito === 'small') {
  //     this.result.forEach( cad => {
  //       cad.dataNf.sort( (a, b) => {
  //         if (a.credito > b.credito) { return 1; }
  //         if (a.credito < b.credito) { return -1; }
  //         return 0;
  //       });
  //     });
  //   }
  //   console.log('new result', this.result);
  // }

}

export interface ExploreResult extends SheetMatch {
  totalValue: number;
  numNotas: number;
  notaWithValue: number;
}
