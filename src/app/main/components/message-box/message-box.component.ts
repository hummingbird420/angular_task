import { Component, Input, OnInit } from '@angular/core';

export enum MessageBoxType {
  INFO,
  WARNING,
  DANGER,
}

@Component({
  selector: 'o-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent implements OnInit {
  @Input() type: MessageBoxType = MessageBoxType.INFO;
  @Input() message: string = 'I am here to give you a message.';
  typeClass: string = MessageBoxType[this.type].toLowerCase();

  ngOnInit(): void {
    this.typeClass = MessageBoxType[this.type].toLowerCase();
  }
  getIcon() {
    switch (this.type) {
      default:
      case MessageBoxType.INFO:
        return 'error';
      case MessageBoxType.WARNING:
        return 'warning';
      case MessageBoxType.DANGER:
        return 'dangerous';
    }
  }
}
