import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuxiliaryService {

  // cadastradores
  public cadastradores$: Observable<FileInfo>;
  protected subjCadastradores: BehaviorSubject<FileInfo>;
  // liberados
  public liberados$: Observable<FileInfo>;
  protected subjLiberados: BehaviorSubject<FileInfo>;

  protected filesRead: RequiredFiles = { cadastradores: false, liberados: false };


  constructor(
    private snackBar: MatSnackBar
  ) {
    this.subjCadastradores = new BehaviorSubject<FileInfo>({} as FileInfo);
    this.cadastradores$ = this.subjCadastradores.asObservable();
    this.subjLiberados = new BehaviorSubject<FileInfo>({} as FileInfo);
    this.liberados$ = this.subjLiberados.asObservable();
    // determina se os arquivos necessários já foram carregados
    this.cadastradores$.subscribe(res => this.filesRead.cadastradores = res.fileInfo?.name ? true : false);
    this.liberados$.subscribe(res => this.filesRead.liberados = res.fileInfo?.name ? true : false);
  }

  prossessFiles(data: DataTransfer | any): void {
    const files: File[] = data.files;
    if (files.length > 2) { this.setSnackbar('apenas duas planilhas são permitida'); }
    const excelFiles: File[] = [];
    for (const file of files) {
      const typeArray = file.type.split('.');
      const validFile = typeArray.includes('ms-excel') || typeArray.includes('spreadsheetml') && typeArray.includes('sheet');
      if (validFile) { excelFiles.push(file);
      } else { this.setSnackbar(`arquivo "${file.name}" não é uma planilha`); }
    }
    if (excelFiles.length > 0) { this.prossessExcel(excelFiles); }
  }

  prossessExcel(files: File[]): void {
    if (!this.filesRead.cadastradores || !this.filesRead.liberados) {
      for (const file of files) {
        // wire up file reader
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          // read workbook
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          // grab first sheet
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          // save data
          const data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as any[][];
          this.handleSheetType(file, data);
        };
        reader.readAsBinaryString(file);
      }
    } else { this.setSnackbar('já temos as planilhas necessárias'); }
  }

  handleSheetType(file: File, data: any[][]): void {
    if (this.sheetValidation(data) === 'cadastradores') {
      if (!this.filesRead.cadastradores) {
        this.subjCadastradores.next(
          { sheet: data, headers: data[0], fileInfo: file, type: 'cadastradores' });
      } else { this.setSnackbar('apenas uma planilha de cadastradores é permitida'); }
    } else if (this.sheetValidation(data) === 'liberados') {
      if (!this.filesRead.liberados) {
      this.subjLiberados.next(
        { sheet: data, headers: data[0], fileInfo: file, type: 'liberados' });
      } else { this.setSnackbar('apenas uma planilha de valores liberados é permitida'); }
    } else { this.setSnackbar(`planilha "${file.name}" não é válida`); }
  }

  sheetValidation(sheet: any[][]): 'cadastradores' | 'liberados' | null {
    const sheetHeaders = sheet[0];
    const headers = JSON.parse(JSON.stringify(requiredHeaders));
    sheetHeaders.forEach( header => headers[header] = true);
    if (headers['Número da Nota'] && headers['CPF Doador/Cadastrador'] && headers['CNPJ Estabelecimento']) { return 'cadastradores';
    } else if (headers.No || headers['No.'] && headers['CNPJ emit.'] || headers['CNPJ emit'] && headers.Créditos) { return 'liberados';
    } else { return null; }
  }

  removeFile(fileType: 'cadastradores' | 'liberados'): void {
    if (fileType === 'cadastradores') { this.subjCadastradores.next({} as FileInfo);
    } else if (fileType === 'liberados') { this.subjLiberados.next({} as FileInfo); }
  }

  setSnackbar(message: string): void {
    this.snackBar.open(message, null,
      { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top' });
  }

  // export(): void {
  //   /* generate worksheet */
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);
  // }
}

export const requiredHeaders = {
  'Número da Nota': false,
  'Valor da Nota': false,
  'Data da Nota': false,
  'CNPJ Entidade Social': false,
  'CPF Doador/Cadastrador': false,
  'Data do Pedido': false,
  'Status do Pedido': false,
  'Tipo do Pedido': false,
  'CNPJ Estabelecimento': false,

  'CNPJ emit.': false,
  'CNPJ emit': false,
  Emitente: false,
  'No.': false,
  No: false,
  'Data Emissão': false,
  'Valor NF': false,
  'Data Registro': false,
  Créditos: false,
  'Situação do Crédito': false,
};

export interface FileInfo {
  sheet?: any[][];
  headers?: string[];
  fileInfo: File;
  type: 'cadastradores' | 'liberados';
}

export interface RequiredFiles {
  cadastradores: boolean;
  liberados: boolean;
}
