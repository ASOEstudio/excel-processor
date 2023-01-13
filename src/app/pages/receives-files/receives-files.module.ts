import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivesFilesComponent } from './receives-files.component';
import { UploadModule } from 'src/app/components/upload/upload.module';
import { ListFilesModule } from 'src/app/components/list-files/list-files.module';
import { PageBackModule } from 'src/app/components/page-back/page-back.module';

@NgModule({
  declarations: [ReceivesFilesComponent],
  imports: [CommonModule, UploadModule, ListFilesModule, PageBackModule],
  exports: [ReceivesFilesComponent],
})
export class ReceivesFilesModule {}
