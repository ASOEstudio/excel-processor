import { Component, OnInit, Input } from '@angular/core';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-back',
  templateUrl: './page-back.component.html',
  styleUrls: ['./page-back.component.scss']
})
export class PageBackComponent implements OnInit {

  @Input() pageDescription: string;

  public faArrowLeft = faArrowLeft;
  public hoverbutton = false;

  constructor(
    private location: Location,
  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.location.back();
  }

}
