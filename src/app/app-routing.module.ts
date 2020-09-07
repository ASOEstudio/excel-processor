import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivesFilesComponent } from './pages/receives-files/receives-files.component';
import { ProcessExcelComponent } from './pages/process-excel/process-excel.component';

const routes: Routes = [
  { path: '',
    component: ReceivesFilesComponent },
  { path: 'process-excel',
    component: ProcessExcelComponent },
  { path: '**',
    redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
