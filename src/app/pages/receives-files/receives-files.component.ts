import { Component, OnInit } from '@angular/core';
import { AuxiliaryService } from 'src/app/services/auxiliary.service';

@Component({
  selector: 'app-receives-files',
  templateUrl: './receives-files.component.html',
  styleUrls: ['./receives-files.component.scss'],
})
export class ReceivesFilesComponent implements OnInit {
  constructor(private auxiliary: AuxiliaryService) {}

  ngOnInit(): void {
    this.auxiliary.removeResults();
  }
}
