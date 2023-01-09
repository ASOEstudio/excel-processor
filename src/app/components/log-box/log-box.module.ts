import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogBoxComponent } from './log-box.component';

@NgModule({
  declarations: [LogBoxComponent],
  imports: [CommonModule],
  exports: [LogBoxComponent],
})
export class LogBoxModule {}
