import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  getPromise<T>(url: string): Promise<T> {
    return this.get<T>(url).toPromise();
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  postPromise<T>(url: string, body: any): Promise<T> {
    return this.post<T>(url, body).toPromise();
  }
  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}

export const ApiRootUrl = {
  campus_root: 'campus/',
};

export const ApiUrl = {
  logo: 'logo/',
  setup_items: 'setup-items',
  system_options: 'system-options',

  admin_widgets: 'admin-widgets',
  task_widgets: 'student/widget/task',

  account_profile_record_section: 'account-profile-record-sections',
  account_profile_fields: 'account-profile-fields',

  semester_datatable_columns: 'semester/datatable-columns',
  semesters: 'semester/all',
  semester_info: 'semester/info/',
  semester_fields: 'semester/fields/',
  semester_save: 'semester/save',
  semester_delete: 'semester/delete',
  semester_dropdown: 'semester/dropdown',
  semester_info_right_links: 'semester/info-right-links',

  department_table_columns: 'level/datatable-columns',
  department_fields: 'level/fields/',
  departments: 'level/all',
  department_info: 'level/info/',
  levels_by_user: 'level/levels-by-user',
  save_department: 'level/save',
  delete_department: 'level/delete/',
  department_info_right_links: 'level/info-right-links',
  departments_right_links: 'level/levels-right-links',
  department_dropdown: 'level/dropdown/',

  curriculum_datatable_columns: 'curriculum/datatable-columns',
  curriculum_fields: 'curriculum/fields/',
  curriculumns: 'curriculum/all',
  curriculum_info: 'curriculum/info/',
  save_curriculum: 'curriculum/save',
  curriculum_dropdown: 'curriculum/dropdown/',
  delete_curriculum: 'curriculum/delete/',

  course_categories: 'course-category/all',
  save_course_categories: 'course-category/save',

  campus_datatable_columns: `${ApiRootUrl.campus_root}datatable-columns/`,
  campus_status_dropdown: `${ApiRootUrl.campus_root}status-dropdown/`,
  campuses: `${ApiRootUrl.campus_root}infos/`,
  campus_info: `${ApiRootUrl.campus_root}info/`,
  campus_record_sections: `${ApiRootUrl.campus_root}record-sections`,
  campus_standard_fields: 'campus/standard-fields/',
  campus_fields: 'campus/fields/',
  campus_dropdown: 'campus/dropdown/',

  list_type: 'list-code/list-type/',
  list_codes: 'list-code/listcodes/',
  save_listcodes: 'list-code/save-listcodes/',

  response_set_type: 'response-set-type',
  response_sets: 'response-sets',
  response_set_info: 'response-set-info/',
  responses: 'responses/',
  save_response_set: 'save-response-set',
  save_responses: 'save-responses/',
  delete_response_set: 'delete-response-set/',

  payment_plan: 'payment-plans',
  payment_plans_by_subject: 'payment-plans-by-subject/',
  payment_plans_by_class: 'payment-plans-by-class/',

  classroom_datatable_columns: 'classroom/datatable-columns',
  classrooms: 'classroom/all',
  classroom_field_names: 'classroom/fields',
  classroom_details: 'classroom/info/',
  save_classroom: 'classroom/save',
  delete_classroom: 'classroom/delete/',

  subject_table_columns: 'course/datatable-columns',
  subject_fields: 'course/fields/',
  subject_standard_fields: 'course/standard-fields/',
  subject_sortorder: 'course/sortorder/',
  subject_record_sections: 'course/record-sections',
  subjects: 'course/all/',
  subject_info: 'course/info/',
  save_subject: 'course/save',
  save_sortorder: 'course/save-sortorder/',
  subjects_right_links: 'course/right-links',
  subject_info_right_links: 'course/info-right-links',
  subject_record_template_right_links: 'course/record-template-right-links',
  search_subject_right_links: 'course/search-right-links',
  search_subject_result_right_links: 'course/search-result-ight-links',

  program_filter_fields: 'program/filter-fields',
  program_datatable_columns: 'program/datatable-columns',
  program_fields: 'program/fields/',
  programs: 'program/all/',
  program_info: 'program/info/',
  program_save: 'program/save',
  program_delete: 'program/delete',
  programs_right_links: 'program/right-links',
  program_info_right_links: 'program/info-right-links',
};
