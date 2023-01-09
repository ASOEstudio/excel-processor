import { Component, OnInit, Input } from '@angular/core';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-back',
  templateUrl: './page-back.component.html',
  styleUrls: ['./page-back.component.scss'],
})
export class PageBackComponent implements OnInit {
  @Input() pageDescription: string;
  @Input() route: string;

  public faArrowLeft = faArrowLeft;
  public hoverbutton = false;

  constructor() {}

  ngOnInit(): void {}
}
