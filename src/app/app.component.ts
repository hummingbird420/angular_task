import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from './app.state';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'o-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'liquid-ui';
  @Select(AppState.isLoading)
  isLoading$!: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private loaderService: LoaderService
  ) {
    this.loaderService.initializeLoader();
  }
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRout: any = this.getChild(this.activatedRoute);
        currentRout.data.subscribe((data: any) => {
          const title = data.title || 'Liquid UI';
          this.titleService.setTitle(title);
        });
      });
  }
  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
