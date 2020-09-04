import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,

    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
  ],
  exports: [
    FontAwesomeModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class SharedModule { }
