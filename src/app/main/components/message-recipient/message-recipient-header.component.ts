import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NavigationField } from 'src/app/models';

@Component({
  selector: 'o-message-recipient-header',
  templateUrl: './message-recipient-header.component.html',
  styleUrls: ['./message-recipient-header.component.scss'],
})
export class MessageRecipientHeaderComponent implements OnInit {
  @Input() NavigationSource!: NavigationField;
  constructor() {}

  ngOnInit(): void {
    console.log(this.NavigationSource);
  }

  onChangeCampus(event: any) {}
  setActive() {
    return true;
  }
}
