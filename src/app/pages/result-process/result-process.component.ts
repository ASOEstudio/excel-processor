import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuxiliaryService, SheetMatch } from 'src/app/services/auxiliary.service';

@Component({
  selector: 'app-result-process',
  templateUrl: './result-process.component.html',
  styleUrls: ['./result-process.component.scss']
})
export class ResultProcessComponent implements OnInit, OnDestroy {

  public result: SheetMatch[];

  public columnsLabel: string[];

  constructor(
    private auxiliary: AuxiliaryService,
    private router: Router,
  ) {
    this.auxiliary.result$.subscribe(res => { if (!res[0]) { this.router.navigate(['/']); } else { this.result = res; } });
  }

  ngOnInit(): void {
    this.columnsLabel = Object.keys(this.result[0].dataNf[0]);
    console.log('columns', this.columnsLabel);
  }

  ngOnDestroy(): void {
    this.auxiliary.removeResults();
  }

}
