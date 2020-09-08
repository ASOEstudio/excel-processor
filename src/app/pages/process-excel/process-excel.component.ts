import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuxiliaryService } from 'src/app/services/auxiliary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-excel',
  templateUrl: './process-excel.component.html',
  styleUrls: ['./process-excel.component.scss']
})
export class ProcessExcelComponent implements OnInit, AfterViewInit {

  constructor(
    private auxiliary: AuxiliaryService,
    private router: Router,
  ) {
    this.auxiliary.cadastradores$.subscribe(res => { if (!res.type) { this.router.navigate(['/']); } });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.auxiliary.initProcessingFlow();
    }, 100);
  }

}
