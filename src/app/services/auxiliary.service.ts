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
  // log
  public log$: Observable<string>;
  protected subjLog: BehaviorSubject<string>;

  protected filesRead: RequiredFiles = { cadastradores: false, liberados: false };
  protected cadastradoresData: any[][];
  protected liberadosData: any[][];
  protected cpfCadastradores: string[] = [];

  constructor(
    private snackBar: MatSnackBar
  ) {
    this.subjCadastradores = new BehaviorSubject<FileInfo>({} as FileInfo);
    this.cadastradores$ = this.subjCadastradores.asObservable();
    this.subjLiberados = new BehaviorSubject<FileInfo>({} as FileInfo);
    this.liberados$ = this.subjLiberados.asObservable();
    this.subjLog = new BehaviorSubject<string>('');
    this.log$ = this.subjLog.asObservable();
    // determina se os arquivos necessários já foram carregados
    this.cadastradores$.subscribe(res => {
      this.cadastradoresData = res.sheet;
      this.filesRead.cadastradores = res.fileInfo?.name ? true : false; });
    this.liberados$.subscribe(res => {
      this.liberadosData = res.sheet;
      this.filesRead.liberados = res.fileInfo?.name ? true : false; });
  }

  public prossessFiles(data: DataTransfer | any): void {
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

  protected prossessExcel(files: File[]): void {
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

  protected handleSheetType(file: File, data: any[][]): void {
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

  protected sheetValidation(sheet: any[][]): 'cadastradores' | 'liberados' | null {
    const sheetHeaders = sheet[0];
    const headers = JSON.parse(JSON.stringify(requiredHeaders));
    sheetHeaders.forEach( header => headers[header] = true);
    if (headers['Número da Nota'] && headers['CPF Doador/Cadastrador'] && headers['CNPJ Estabelecimento']) { return 'cadastradores';
    } else if (headers.No || headers['No.'] && headers['CNPJ emit.'] || headers['CNPJ emit'] && headers.Créditos) { return 'liberados';
    } else { return null; }
  }

  public removeFile(fileType: 'cadastradores' | 'liberados'): void {
    if (fileType === 'cadastradores') { this.subjCadastradores.next({} as FileInfo);
    } else if (fileType === 'liberados') { this.subjLiberados.next({} as FileInfo); }
  }

  public setSnackbar(message: string): void {
    this.snackBar.open(message, null,
      { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top' });
  }

  public addLogLine(logLine: string): void {
    this.subjLog.next(logLine);
  }

  public initProcessingFlow(): void {
    this.addLogLine('inicia o processamento das planilhas');
    // remove linhas em branco Cadastradores
    this.addLogLine('remove linhas em branco da planilha de Cadastradores');
    const endLineCadastradores = this.cadastradoresData[0].length - 1;
    let contCadastradores = 0;
    const linesRemoveCadastradores: number[] = [];
    this.cadastradoresData.forEach( (line: any[], i) => { if (!line[endLineCadastradores]) { linesRemoveCadastradores.push(i); } });
    linesRemoveCadastradores.forEach( indexNum => {
      this.cadastradoresData.splice(indexNum - contCadastradores, 1);
      ++contCadastradores;
    });
    // remove linhas em branco Liberados
    this.addLogLine('remove linhas em branco da planilha de Liberados');
    const endLineLiberados = this.liberadosData[0].length - 1;
    let contLiberados = 0;
    const linesRemoveLiberados: number[] = [];
    this.liberadosData.forEach( (line: any[], i) => { if (!line[endLineLiberados]) { linesRemoveLiberados.push(i); } });
    linesRemoveLiberados.forEach( indexNum => {
      this.liberadosData.splice(indexNum - contLiberados, 1);
      ++contLiberados;
    });
    this.getCpf();
  }

  protected getCpf(): void {
    this.addLogLine('identifica cpf de cadastradores');
    console.log(this.cadastradoresData, this.liberadosData);
    const indexCpf = this.cadastradoresData[0].indexOf('CPF Doador/Cadastrador');
    console.log(indexCpf);
    this.cadastradoresData.forEach( (line: any[], i) => {
      if (i > 0 && !this.cpfCadastradores.find(item => item === line[indexCpf])) { this.cpfCadastradores.push(line[indexCpf]); }
    });
  }
  // protected getNotaFiscal(): void {
  //   this.addLogLine('identificando todas os números de notas fiscais cadastradas');
  //   const
  // }
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
