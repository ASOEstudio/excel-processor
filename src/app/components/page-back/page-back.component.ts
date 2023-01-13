import { Component, OnInit, Input } from '@angular/core';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-back',
  templateUrl: './page-back.component.html',
  styleUrls: ['./page-back.component.scss'],
})
export class PageBackComponent implements OnInit {
  @Input() pageBackDescription: string;
  @Input() backRoute: string;
  @Input() pageNextDescription: string;
  @Input() nextRoute: string;

  public faArrowLeft = faArrowLeft;
  public hoverBackButton = false;
  public hoverNextButton = false;

  constructor() {}

  ngOnInit(): void {}
}
