import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { openClose, rotate } from 'src/app/animations/animation';
import { MenuItem } from 'src/app/models';
import { Menu } from 'src/app/models/menu';
import { ApiService, AuthService, DictionaryService, FileService } from 'src/app/services';
import { RightLinkService } from 'src/app/services/right-link.service';
import { log } from 'src/loggers/logger';

@Component({
  selector: 'o-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [openClose, rotate('rotateLeftRight', 'left', 'right', -180)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  title: string = '';
  subTitle: string = '';
  menus: Menu[] = [];
  currentMenuId: string = '';
  name: string = '';
  roleName: string = '';
  schoolName: string = '';
  defaultLogo: string = 'assets/images/logo_blue.png';
  logId: string = '0';
  logo: Observable<string> = of(this.defaultLogo);
  expand: boolean = true;
  showSchoolName: boolean = true;
  headerAlign: string = 'center center';

  // right links
  rightLinks$: Observable<MenuItem[]> = of([]);
  isRightLinkNotEmpty$: Observable<boolean> = of(false);

  destroyed = new Subject<void>();

  activeMenuItem: string = '';
  mouseHoverActivated: boolean = false;
  smallDevice: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private dictionaryService: DictionaryService,
    private fileService: FileService,
    private rightLinkService: RightLinkService,
    private apiService: ApiService
  ) {
    this.rightLinks$ = of([{} as MenuItem]);
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit(): void {
    this.authService
      .getUser()
      .pipe(takeUntil(this.destroyed))
      .subscribe((user) => {
        if (user) {
          this.name = user.name;
          this.roleName = user.roleName;
          this.schoolName = user.schoolName;
          if (this.logId === '0' || this.logId !== user.logoId) {
            this.logId = user.logoId;
            this.logo = this.fileService.getLogo(user.logoId);
          }

          this.showSchoolName = user.globalOptions.includes('[HIDE_SCHOOL_NAME]') == false;
          this.cdRef.detectChanges();
        }
      });
    this.apiService
      .get<Menu[]>('/student/menu')
      .pipe(takeUntil(this.destroyed))
      .subscribe((data) => {
        this.menus = data;
        if (this.menus.length) {
          this.currentMenuId = this.menus[0].menuId || 'home';
        }
        this.cdRef.detectChanges();
      });

    this.rightLinks$ = this.rightLinkService.getRightLinks();
    this.rightLinks$.pipe(takeUntil(this.destroyed)).subscribe((data) => {
      this.isRightLinkNotEmpty$ = of(data.length > 0);
    });

    this.onViewChange();
  }

  onViewChange() {
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        if (result.matches) {
          this.expand = false;
        } else {
          this.expand = true;
        }
        this.smallDevice = result.matches;
        if (this.showSchoolName) {
          this.headerAlign = 'start center';
        }
        this.cdRef.detectChanges();
      });
  }

  onLogoError() {
    this.logo = of(this.defaultLogo);
    this.logId = '0';
  }

  getTranslatedWord(word: string): string {
    return this.dictionaryService.getTranslationOrWord(word);
  }

  isExpanded(menuId?: string): boolean {
    return this.currentMenuId == menuId;
  }

  onClickMenuItem(itemId: string) {
    this.onViewChange();
    this.activeMenuItem = itemId;
  }

  toogleSideNav() {
    this.expand = !this.expand;
  }

  onMouseEnterSideNav() {
    if (this.expand) {
      return;
    }
    this.expand = true;
    this.mouseHoverActivated = true;
  }

  onMouseLeaveSideNav() {
    if (this.expand && this.mouseHoverActivated) {
      this.expand = false;
      this.mouseHoverActivated = false;
    }
  }

  logout() {
    log('looging out');
    this.authService.logout();
  }

  getMenuIconName(menuId?: string): string {
    switch (menuId) {
      case '[ACOMMUNICATION]':
        return 'mail';
      case '[ASTAFFCONTACT]':
        return 'groups';
      case '[STUDENTS]':
        return 'person_outline';
      case '[ACADEMICS]':
        return 'school';
      case '[FINANCE]':
        return 'monetization_on';
      case '[SCHEDULES]':
        return 'schedule';
      case '[AREFERENCE]':
        return 'library_books';
      case '[PRINTING]':
        return 'print';
      case '[AQUERYREPORTS]':
        return 'analytics';
      case '[ATRACKING]':
        return 'room';
      case '[SETUPCUST]':
        return 'settings';
      default:
        return 'south_east';
    }
  }

  getMenuItemIconName(url?: string): string {
    url = url?.substring(url.lastIndexOf('/') + 1);

    switch (url) {
      case 'news-and-announcements':
        return 'campaign';
      case 'instant-alerts':
        return 'notifications';
      case 'messages':
        return 'mail';
      case 'instructors':
        return 'groups';
      case 'staffs':
        return 'group';
      case 'contacts':
        return 'contact_phone';
      case 'applications':
        return 'play_arrow';
      case 'applications':
        return 'play_arrow';
      case 'students':
        return 'play_arrow';
      case 'classes':
        return 'class';
      case 'class-groups':
        return 'play_arrow';
      case 'grades':
        return 'grade';
      case 'independent-study':
        return 'play_arrow';
      case 'attendance':
        return 'play_arrow';
      case 'post-payments-group':
        return 'play_arrow';
      case 'accounts-receivable-report':
        return 'play_arrow';
      case 'student-billing-journal':
        return 'play_arrow';
      case 'export-quickBooks':
        return 'play_arrow';
      case 'pending-payments':
        return 'play_arrow';
      case 'auto-charge-report':
        return 'play_arrow';
      case 'payment-chart':
        return 'play_arrow';
      case 'class-schedules':
        return 'play_arrow';
      case 'master-schedules':
        return 'play_arrow';
      case 'independent-study-schedules':
        return 'play_arrow';
      case 'room schedules':
        return 'play_arrow';
      case 'modular schedules':
        return 'play_arrow';
      case 'exam schedules':
        return 'play_arrow';
      case 'tasks-calendar':
        return 'play_arrow';
      case 'events-calendar':
        return 'play_arrow';
      case 'instructor-directory':
        return 'play_arrow';
      case 'repository':
        return 'play_arrow';
      case 'book-list':
        return 'play_arrow';
      case 'library':
        return 'play_arrow';
      case 'equipment':
        return 'play_arrow';
      case 'correspondences':
        return 'play_arrow';
      case 'workflow-automation':
        return 'play_arrow';
      case 'forms':
        return 'play_arrow';
      case 'custom-printing':
        return 'play_arrow';
      case 'batch-printing':
        return 'play_arrow';
      case 'label-printing':
        return 'play_arrow';
      case 'custom-reports':
        return 'play_arrow';
      case 'query-reports':
        return 'play_arrow';
      case 'standard-reports':
        return 'play_arrow';
      case 'client-specific-reports':
        return 'play_arrow';
      case 'email-reports':
        return 'play_arrow';
      case 'multirecipient-email-reports':
        return 'play_arrow';
      case 'complaints-and-issues':
        return 'play_arrow';
      case 'shipping tickets':
        return 'play_arrow';
      case 'textbook-inventory':
        return 'play_arrow';
      case 'product-inventory':
        return 'play_arrow';
      case 'account-profile':
        return 'manage_accounts';
      case 'user-features':
        return 'assignment_ind';
      case 'system-options':
        return 'play_arrow';
      case 'display-options':
        return 'play_arrow';
      case 'start-page-setup':
        return 'play_arrow';
      case 'payment-setup':
        return 'payments';
      case 'additional-setup':
        return 'tune';
      case 'online-application-setup':
        return 'settings_applications';
      case 'shopping-cart-setup':
        return 'shopping_cart';
      case 'calendar-registration-setup':
        return 'play_arrow';
      case 'contact-form-setup':
        return 'play_arrow';
      case 'career-placement-form-setup':
        return 'play_arrow';
      case 'ldap-settings':
        return 'play_arrow';
      case 'quickbooks-settings':
        return 'play_arrow';
      case 'docusign-setup':
        return 'tune';
      case 'semesters':
        return 'tune';
      case 'cohorts':
        return 'tune';
      case 'tuitions':
        return 'tune';
      case 'fees':
        return 'tune';
      case 'import':
        return 'cloud_upload';
      case 'export':
        return 'cloud_download';
      case 'customization':
        return 'build_circle';
      default:
        return 'play_arrow';
    }
  }
}
