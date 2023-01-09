import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from 'src/app/shared/drag-drop/drag-drop.module';

@NgModule({
  declarations: [UploadComponent],
  imports: [CommonModule, SharedModule, DragDropModule],
  exports: [UploadComponent],
})
export class UploadModule {}
