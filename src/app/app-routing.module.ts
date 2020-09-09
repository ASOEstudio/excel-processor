import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivesFilesComponent } from './pages/receives-files/receives-files.component';
import { ProcessExcelComponent } from './pages/process-excel/process-excel.component';
import { ResultProcessComponent } from './pages/result-process/result-process.component';

const routes: Routes = [
  { path: '', redirectTo: 'receives-files', pathMatch: 'full' },
  { path: 'receives-files', component: ReceivesFilesComponent },
  { path: 'process-excel', component: ProcessExcelComponent },
  { path: 'result-process', component: ResultProcessComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
