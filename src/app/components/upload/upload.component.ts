import { Component, OnInit } from '@angular/core';

import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { AuxiliaryService, RequiredFiles } from 'src/app/services/auxiliary.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  disabledUpload: RequiredFiles = { cadastradores: false, liberados: false };
  fileOver = false;
  uploadIcon = faUpload;

  constructor(
    private auxiliary: AuxiliaryService
  ) { }

  ngOnInit(): void {
    this.auxiliary.cadastradores$.subscribe(res => this.disabledUpload.cadastradores = res.fileInfo?.name ? true : false);
    this.auxiliary.liberados$.subscribe(res => this.disabledUpload.liberados = res.fileInfo?.name ? true : false);
  }

  receiveFiles(event, input = false): void {
    if (input) { this.auxiliary.processFiles(event.target);
    } else { this.auxiliary.processFiles(event); }
  }

}
