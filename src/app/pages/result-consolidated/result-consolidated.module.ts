import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ResultConsolidatedComponent } from './result-consolidated.component';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from 'src/app/shared/shared.module';
import { PageBackModule } from 'src/app/components/page-back/page-back.module';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

@NgModule({
  declarations: [ResultConsolidatedComponent],
  imports: [
    CommonModule,
    ScrollingModule,

    MatTableModule,
    MatFormFieldModule,
    MatInputModule,

    SharedModule,
    PageBackModule,
    TableVirtualScrollModule,
  ],
  exports: [ResultConsolidatedComponent],
})
export class ResultConsolidatedModule {}
