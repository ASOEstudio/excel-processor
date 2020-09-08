import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuxiliaryService } from 'src/app/services/auxiliary.service';

@Component({
  selector: 'app-log-box',
  templateUrl: './log-box.component.html',
  styleUrls: ['./log-box.component.scss']
})
export class LogBoxComponent implements OnInit, OnDestroy {

  public itemsList: string[] = [];
  public expanded = false;
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
