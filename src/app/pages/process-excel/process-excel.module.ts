import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProcessExcelComponent } from './process-excel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageBackModule } from 'src/app/components/page-back/page-back.module';
import { LogBoxModule } from 'src/app/components/log-box/log-box.module';

@NgModule({
  declarations: [ProcessExcelComponent],
  imports: [
    CommonModule,
    RouterModule,

    SharedModule,
    PageBackModule,
    LogBoxModule,
  ],
  exports: [ProcessExcelComponent],
})
export class ProcessExcelModule {}
