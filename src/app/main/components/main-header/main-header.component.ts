import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AuthService, DictionaryService, FileService } from 'src/app/services';

@Component({
  selector: 'o-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
  private destroyed$ = new Subject<void>();
  schoolName: string = '';
  defaultLogo: string = 'assets/images/logo_blue.png';
  logo: Observable<string> = of(this.defaultLogo);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private dictionaryService: DictionaryService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  onLogoError() {
    this.logo = of(this.defaultLogo);
    // this.logo = this.fileService.getLogo(user.logoId);
  }

  getTranslatedWord(word: string): Observable<String> {
    return this.dictionaryService.getTranslatedWord(word);
  }
  logout() {
    this.authService.logout();
  }
}
