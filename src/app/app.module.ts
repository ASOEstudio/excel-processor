import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReceivesFilesModule } from './pages/receives-files/receives-files.module';
import { ProcessExcelModule } from './pages/process-excel/process-excel.module';
import { AuxiliaryService } from './services/auxiliary.service';
import { ResultProcessModule } from './pages/result-process/result-process.module';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    ReceivesFilesModule,
    ProcessExcelModule,
    ResultProcessModule,
    MatSnackBarModule,
  ],
  providers: [AuxiliaryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
