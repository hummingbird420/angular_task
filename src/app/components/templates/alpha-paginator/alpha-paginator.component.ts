import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'o-alpha-paginator',
  templateUrl: './alpha-paginator.component.html',
  styleUrls: ['./alpha-paginator.component.scss'],
})
export class AlphaPaginatorComponent implements OnInit {
  letters: string[];
  @Input()
  activeLetter: string;
  @Output() pageChange: EventEmitter<string>;

  constructor() {
    this.letters = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'ALL',
    ];
    this.activeLetter = this.letters[0];
    this.pageChange = new EventEmitter<string>();
  }

  ngOnInit(): void {}

  active(letter: string) {
    return this.activeLetter == letter ? 'active' : '';
  }

  showPage(letter: string) {
    this.activeLetter = letter;
    this.pageChange.emit(letter);
  }
}
