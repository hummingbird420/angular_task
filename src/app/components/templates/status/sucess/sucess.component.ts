import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'o-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.scss', './success.animation.scss'],
})
export class SucessComponent implements OnInit {
  constructor(@Inject('SUCCESS_MSG') public message: string) {}

  ngOnInit(): void {}
}
