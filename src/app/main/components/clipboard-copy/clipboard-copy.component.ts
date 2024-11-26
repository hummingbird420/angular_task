import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'o-clipboard-copy',
  templateUrl: './clipboard-copy.component.html',
  styleUrls: ['./clipboard-copy.component.scss'],
})
export class ClipboardCopyComponent implements OnInit {
  copied: boolean = false;
  @Input() copyText: string = '';
  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}
  copy() {
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
      this.cdRef.detectChanges();
    }, 1000);
  }
}
