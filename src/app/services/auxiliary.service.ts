import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExploreResult } from '../pages/result-process/result-process.component';

@Injectable({
  providedIn: 'root',
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
  // log
  public result$: Observable<SheetMatch[]>;
  protected subjResult: BehaviorSubject<SheetMatch[]>;

  // index
  iNo: number;
  iCnpjEmit: number;
  iCreditos: number;
  iSitCred: number;
  iEmitente: number;
  iCpf: number;
  iNumNota: number;
  iCnpjEstab: number;

  protected filesRead: RequiredFiles = {
    cadastradores: false,
    liberados: false,
  };
  protected cadastradoresData: any[][];
  protected liberadosData: any[][];
  protected notasCpf: SheetMatch[] = [];

  constructor(private snackBar: MatSnackBar, private router: Router) {
    this.subjCadastradores = new BehaviorSubject<FileInfo>({} as FileInfo);
    this.cadastradores$ = this.subjCadastradores.asObservable();
    this.subjLiberados = new BehaviorSubject<FileInfo>({} as FileInfo);
    this.liberados$ = this.subjLiberados.asObservable();
    this.subjLog = new BehaviorSubject<string>('');
    this.log$ = this.subjLog.asObservable();
    this.subjResult = new BehaviorSubject<SheetMatch[]>([]);
    this.result$ = this.subjResult.asObservable();
    // determina se os arquivos necessários já foram carregados
    this.cadastradores$.subscribe((res) => {
      this.cadastradoresData = res.sheet;
      this.filesRead.cadastradores = res.fileInfo?.name ? true : false;
    });
    this.liberados$.subscribe((res) => {
      this.liberadosData = res.sheet;
      this.filesRead.liberados = res.fileInfo?.name ? true : false;
    });
  }

  public processFiles(data: DataTransfer | any): void {
    const files: File[] = data.files;
    if (files.length > 2) {
      this.setSnackbar('apenas duas planilhas são permitida');
    }
    const excelFiles: File[] = [];
    for (const file of files) {
      const typeArray = file.type.split('.');
      const validFile =
        typeArray.includes('ms-excel') ||
        (typeArray.includes('spreadsheetml') && typeArray.includes('sheet'));
      if (validFile) {
        excelFiles.push(file);
      } else {
        this.setSnackbar(`arquivo "${file.name}" não é uma planilha`);
      }
    }
    if (excelFiles.length > 0) {
      this.processExcel(excelFiles);
    }
  }

  protected processExcel(files: File[]): void {
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
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
          this.handleSheetType(file, data);
        };
        reader.readAsBinaryString(file);
      }
    } else {
      this.setSnackbar('já temos as planilhas necessárias');
    }
  }

  protected handleSheetType(file: File, data: any[][]): void {
    if (this.sheetValidation(data) === 'cadastradores') {
      if (!this.filesRead.cadastradores) {
        this.subjCadastradores.next({
          sheet: data,
          headers: data[0],
          fileInfo: file,
          type: 'cadastradores',
        });
      } else {
        this.setSnackbar('apenas uma planilha de cadastradores é permitida');
      }
    } else if (this.sheetValidation(data) === 'liberados') {
      if (!this.filesRead.liberados) {
        this.subjLiberados.next({
          sheet: data,
          headers: data[0],
          fileInfo: file,
          type: 'liberados',
        });
      } else {
        this.setSnackbar(
          'apenas uma planilha de valores liberados é permitida'
        );
      }
    } else {
      this.setSnackbar(`planilha "${file.name}" não é válida`);
    }
  }

  protected sheetValidation(
    sheet: any[][]
  ): 'cadastradores' | 'liberados' | null {
    const sheetHeaders = sheet[0];
    const headers = JSON.parse(JSON.stringify(requiredHeaders));
    sheetHeaders.forEach((header) => (headers[header] = true));
    if (
      headers['Número da Nota'] &&
      headers['CPF Doador/Cadastrador'] &&
      headers['CNPJ Estabelecimento']
    ) {
      return 'cadastradores';
    } else if (
      headers.No ||
      (headers['No.'] && headers['CNPJ emit.']) ||
      (headers['CNPJ emit'] &&
        headers.Créditos &&
        headers['Situação do Crédito'])
    ) {
      return 'liberados';
    } else {
      return null;
    }
  }

  public removeFile(fileType: 'cadastradores' | 'liberados'): void {
    if (fileType === 'cadastradores') {
      this.subjCadastradores.next({} as FileInfo);
    } else if (fileType === 'liberados') {
      this.subjLiberados.next({} as FileInfo);
    }
  }

  public setSnackbar(message: string): void {
    this.snackBar.open(message, null, {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
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
    this.cadastradoresData.forEach((line: any[], i) => {
      if (!line[endLineCadastradores]) {
        linesRemoveCadastradores.push(i);
      }
    });
    linesRemoveCadastradores.forEach((indexNum) => {
      this.cadastradoresData.splice(indexNum - contCadastradores, 1);
      ++contCadastradores;
    });
    // remove linhas em branco Liberados
    this.addLogLine('remove linhas em branco da planilha de Liberados');
    const endLineLiberados = this.liberadosData[0].length - 1;
    let contLiberados = 0;
    const linesRemoveLiberados: number[] = [];
    this.liberadosData.forEach((line: any[], i) => {
      if (!line[endLineLiberados]) {
        linesRemoveLiberados.push(i);
      }
    });
    linesRemoveLiberados.forEach((indexNum) => {
      this.liberadosData.splice(indexNum - contLiberados, 1);
      ++contLiberados;
    });
    this.getIndex();
  }

  protected getIndex(): void {
    this.addLogLine('relaciona cabeçalhos nas planilhas');
    // liberados
    this.iNo =
      this.liberadosData[0].indexOf('No.') !== -1
        ? this.liberadosData[0].indexOf('No.')
        : this.liberadosData[0].indexOf('No');
    this.iCnpjEmit =
      this.liberadosData[0].indexOf('CNPJ emit') !== -1
        ? this.liberadosData[0].indexOf('CNPJ emit')
        : this.liberadosData[0].indexOf('CNPJ emit.');
    this.iCreditos = this.liberadosData[0].indexOf('Créditos');
    this.iSitCred = this.liberadosData[0].indexOf('Situação do Crédito');
    this.iEmitente = this.liberadosData[0].indexOf('Emitente');
    // cadastradores
    this.iCpf = this.cadastradoresData[0].indexOf('CPF Doador/Cadastrador');
    this.iNumNota = this.cadastradoresData[0].indexOf('Número da Nota');
    this.iCnpjEstab = this.cadastradoresData[0].indexOf('CNPJ Estabelecimento');

    this.matchSheets();
  }

  protected matchSheets(): void {
    this.addLogLine('começa a relacionar as planilhas');
    this.cadastradoresData.forEach((cadLin, i) => {
      if (i > 0) {
        const libLin = this.liberadosData.find(
          (line) =>
            line[this.iNo] === cadLin[this.iNumNota] &&
            line[this.iCnpjEmit] === cadLin[this.iCnpjEstab]
        );
        if (libLin) {
          this.addLogLine(
            `número da nota: "${cadLin[this.iNumNota]}" e CNPJ: "${
              cadLin[this.iCnpjEstab]
            }" relacionados`
          );
          const cpfCollected = cadLin[this.iCpf]
            ? cadLin[this.iCpf]
            : 'não identificado';
          if (!this.notasCpf.find((line) => line.cpf === cpfCollected)) {
            this.notasCpf.push({ cpf: cpfCollected, dataNf: [] });
          }
          this.notasCpf.forEach((item) => {
            if (item.cpf === cpfCollected) {
              item.dataNf.push({
                numNota: cadLin[this.iNumNota],
                cnpjEstab: cadLin[this.iCnpjEstab],
                emitente: libLin[this.iEmitente],
                sitCred: libLin[this.iSitCred],
                credito: libLin[this.iCreditos],
              });
            }
          });
        } else {
          this.addLogLine(
            `número da nota: "${cadLin[this.iNumNota]}" e CNPJ: "${
              cadLin[this.iCnpjEstab]
            }" não relacionados`
          );
          if (!this.notasCpf.find((line) => line.cpf === 'não relacionadas')) {
            this.notasCpf.push({ cpf: 'não relacionadas', dataNf: [] });
          }
          this.notasCpf.forEach((item) => {
            if (item.cpf === 'não relacionadas') {
              item.dataNf.push({
                numNota: cadLin[this.iNumNota],
                cnpjEstab: cadLin[this.iCnpjEstab],
                emitente: 'não encontrado',
                sitCred: 'não encontrado',
                credito: 0,
              });
            }
          });
        }
      }
    });
    this.addLogLine('termina processamento das planilhas');
    this.sortCpf();
    this.liberadosTotal();
    this.subjResult.next(this.notasCpf);
    this.addLogLine('redireciona para os resultados');
    this.router.navigate(['/result-process']);
  }

  protected sortCpf(): void {
    this.addLogLine('ordenas CPFs');
    this.notasCpf.forEach((item, i) => {
      if (item.cpf === 'não relacionadas') {
        this.notasCpf.push(item);
        this.notasCpf.splice(i, 1);
      }
    });
  }

  protected liberadosTotal(): void {
    this.addLogLine('trata planilha de liberados');
    this.notasCpf.push({ cpf: 'notas liberadas', dataNf: [] });
    this.liberadosData.forEach((libLin, i) => {
      if (i > 0) {
        this.notasCpf.forEach((item) => {
          if (item.cpf === 'notas liberadas') {
            item.dataNf.push({
              numNota: libLin[this.iNo],
              cnpjEstab: libLin[this.iCnpjEmit],
              emitente: libLin[this.iEmitente],
              sitCred: libLin[this.iSitCred],
              credito: libLin[this.iCreditos],
            });
          }
        });
      }
    });
    this.addLogLine('ordena planilha de liberados');
    this.notasCpf
      .find((item) => item.cpf === 'notas liberadas')
      .dataNf.sort((a, b) => {
        if (a.credito < b.credito) {
          return 1;
        }
        if (a.credito > b.credito) {
          return -1;
        }
        return 0;
      });
  }

  public removeResults(): void {
    this.notasCpf = [] as SheetMatch[];
    this.subjResult.next([]);
  }

  public exportFile(tableData: ExploreResult): void {
    const aoaData: string[][] = tableData.dataNf.map((line) =>
      Object.values(line)
    );
    aoaData.unshift([
      'Nota Fiscal',
      'CNPJ',
      'Emitente',
      'Situação Crédito',
      'Crédito',
    ]);

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoaData);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tableData.cpf);
    /* save to file */
    XLSX.writeFile(wb, `cadastrador_${tableData.cpf}.xlsx`);
  }
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

export interface SheetMatch {
  cpf: string;
  dataNf: DataNf[];
}

export interface DataNf {
  numNota?: number;
  cnpjEstab?: string;
  credito?: number;
  sitCred?: string;
  emitente?: string;
}
