import { Component, OnInit } from '@angular/core';
import { ApiUrl } from 'src/app/services';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './search-course-result.page.html',
  styleUrls: ['./search-course-result.page.scss'],
})
export class SearchCourseResultPage extends Page implements OnInit {
  constructor() {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Search Course/Module', '/setup/search-courses'),
      createBreadcrumb('Search Course/Module Result', undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.search_subject_result_right_links;
  }

  ngOnInit(): void {}
}
