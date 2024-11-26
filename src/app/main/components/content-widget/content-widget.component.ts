import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { BreadcrumbInfo } from 'src/app/main/page';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'o-content-widget',
  templateUrl: './content-widget.component.html',
  styleUrls: ['./content-widget.component.scss'],
})
export class ContentWidgetComponent {
  @Input()
  title: string = '';
  @Input()
  subTitles: BreadcrumbInfo[] = [];
}
