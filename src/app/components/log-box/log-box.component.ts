import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuxiliaryService } from 'src/app/services/auxiliary.service';

@Component({
  selector: 'app-log-box',
  templateUrl: './log-box.component.html',
  styleUrls: ['./log-box.component.scss']
})
export class LogBoxComponent implements OnInit, OnDestroy {

  public itemsList: string[] = [];
  contador = 0;

  lista = ['primeira coisa que vem na cabeça', 'isso ai mano', 'vamo ver se funciona essa parada', 'acho que vai ficar top',
    'da pra deixar as paradas subindo e desfocar a borada', 'ir ocultando na verdade', 'tem que ver como vai ficar', 'se der pra colocar transparente melhor'];

  constructor(
    private auxiliary: AuxiliaryService
  ) { }

  ngOnInit(): void {
    this.auxiliary.log$.subscribe(res => this.itemsList.push(res));
  }

  ngOnDestroy(): void {
    this.itemsList.length = 0;
    this.auxiliary.addLogLine('');
  }

}
