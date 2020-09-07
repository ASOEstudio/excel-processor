import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProcessExcelComponent } from './process-excel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageBackModule } from 'src/app/components/page-back/page-back.module';



@NgModule({
  declarations: [ProcessExcelComponent],
  imports: [
    CommonModule,
    RouterModule,

    SharedModule,
    PageBackModule
  ],
  exports: [ProcessExcelComponent]
})
export class ProcessExcelModule { }
