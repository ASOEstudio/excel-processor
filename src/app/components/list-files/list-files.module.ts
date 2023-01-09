import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ListFilesComponent } from './list-files.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListFilesComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [ListFilesComponent],
})
export class ListFilesModule {}
