import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivesFilesComponent } from './receives-files.component';
import { UploadModule } from 'src/app/components/upload/upload.module';
import { ListFilesModule } from 'src/app/components/list-files/list-files.module';



@NgModule({
  declarations: [ReceivesFilesComponent],
  imports: [
    CommonModule,

    UploadModule,
    ListFilesModule
  ],
  exports: [ReceivesFilesComponent],
})
export class ReceivesFilesModule { }
