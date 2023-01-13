import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReceivesFilesModule } from './pages/receives-files/receives-files.module';
import { ProcessExcelModule } from './pages/process-excel/process-excel.module';
import { AuxiliaryService } from './services/auxiliary.service';
import { ResultProcessModule } from './pages/result-process/result-process.module';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ResultConsolidatedModule } from './pages/result-consolidated/result-consolidated.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    ReceivesFilesModule,
    ProcessExcelModule,
    ResultProcessModule,
    ResultConsolidatedModule,
    MatSnackBarModule,
  ],
  providers: [AuxiliaryService, { provide: LOCALE_ID, useValue: 'pt' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
