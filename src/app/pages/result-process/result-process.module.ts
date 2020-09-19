import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultProcessComponent } from './result-process.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { SharedModule } from 'src/app/shared/shared.module';
import { PageBackModule } from 'src/app/components/page-back/page-back.module';


@NgModule({
  declarations: [ResultProcessComponent],
  imports: [
    CommonModule,

    MatTabsModule,
    MatTableModule,

    SharedModule,
    PageBackModule,
  ],
  exports: [ResultProcessComponent],
})
export class ResultProcessModule { }
