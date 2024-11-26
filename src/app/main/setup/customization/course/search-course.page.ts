import { Component, OnInit } from '@angular/core';
import { ApiUrl } from 'src/app/services';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './search-course.page.html',
  styleUrls: ['./search-course.page.scss'],
})
export class SearchCoursePage extends Page implements OnInit {
  constructor() {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Courses/Modules', '/setup/courses'),
      createBreadcrumb('Search Course/Module', undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.search_subject_right_links;
  }

  ngOnInit(): void {
    //
  }
}
