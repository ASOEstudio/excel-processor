import { Component, OnInit } from '@angular/core';

import {
  faFileExcel,
  faTrash,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import {
  AuxiliaryService,
  RequiredFiles,
  FileInfo,
} from 'src/app/services/auxiliary.service';

@Component({
  selector: 'app-list-files',
  templateUrl: './list-files.component.html',
  styleUrls: ['./list-files.component.scss'],
})
export class ListFilesComponent implements OnInit {
  public requiredFiles: RequiredFiles = {
    cadastradores: false,
    liberados: false,
  };
  public filesReceived: FileInfo[] = [];

  public fileIcon = faFile;
  public excelIcon = faFileExcel;
  public deleteIcon = faTrash;

  constructor(private auxiliary: AuxiliaryService) {}

  ngOnInit(): void {
    this.auxiliary.cadastradores$.subscribe((res) => {
      this.requiredFiles.cadastradores = res.fileInfo?.name ? true : false;
      this.filesReceived.push({ type: res.type, fileInfo: res.fileInfo });
    });
    this.auxiliary.liberados$.subscribe((res) => {
      this.requiredFiles.liberados = res.fileInfo?.name ? true : false;
      this.filesReceived.push({ type: res.type, fileInfo: res.fileInfo });
    });
  }

  removeItem(index: number, file: FileInfo): void {
    this.filesReceived.splice(index, 1);
    this.auxiliary.removeFile(file.type);
  }

  formatBytes(bytes, decimals): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
