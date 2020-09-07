import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageBackComponent } from './page-back.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [PageBackComponent],
  imports: [
    CommonModule,

    FontAwesomeModule,
    MatButtonModule,
  ],
  exports: [PageBackComponent],
})
export class PageBackModule { }
