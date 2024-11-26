import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryResolve } from 'src/app/services/dictionary.resolve';
import {
  CampusDetailsPage,
  CampusesPage,
  CampusRecordTemplatePage,
  ClassroomDetailsPage,
  ClassroomsPage,
  CourseCategoryPage,
  CourseInfoPage,
  CourseRecordTemplatePage,
  CoursesPage,
  CurriculumPage,
  CurriculumsPage,
  CustomizationPage,
  DepartmentDetailsPage,
  DepartmentsPage,
  DictionaryPage,
  LanguagePage,
  ListcodePage,
  PhrasesPage,
  ProgramInfoPage,
  ProgramsPage,
  ResponseSetPage,
  ResponseSetsPage,
  SearchCoursePage,
  SearchCourseResultPage,
  StudentBatchPage,
} from '.';

const deptWords = [
  'Departments',
  'Department Details',
  'New Department',
  'The code',
  'already exists, please try another one.',
];

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CustomizationPage },
      { path: 'listcode/:id', component: ListcodePage },
      { path: 'student-batches', component: StudentBatchPage },

      { path: 'classrooms', component: ClassroomsPage },
      { path: 'classroom-info/:id', component: ClassroomDetailsPage },
      { path: 'new-classroom', component: ClassroomDetailsPage },

      { path: 'response-sets', component: ResponseSetsPage },
      { path: 'response-set/:id', component: ResponseSetPage },
      { path: 'new-response-set', component: ResponseSetPage },

      { path: 'curriculums', component: CurriculumsPage },
      { path: 'curriculum/:id', component: CurriculumPage },
      { path: 'new-curriculum', component: CurriculumPage },

      {
        path: 'departments',
        resolve: { dictionaryResolve: DictionaryResolve },
        data: { words: ['Departments', 'New Department'] },
        component: DepartmentsPage,
      },
      {
        path: 'department-info/:id',
        resolve: { dictionaryResolve: DictionaryResolve },
        data: { words: deptWords },
        component: DepartmentDetailsPage,
      },
      {
        path: 'new-department',
        resolve: { dictionaryResolve: DictionaryResolve },
        data: { words: deptWords },
        component: DepartmentDetailsPage,
      },

      { path: 'dictionary', component: DictionaryPage },
      { path: 'language-info/:id', component: LanguagePage },
      { path: 'new-language', component: LanguagePage },
      { path: 'phrases', component: PhrasesPage },

      { path: 'course-categories', component: CourseCategoryPage },
      { path: 'courses', component: CoursesPage },
      { path: 'course-info/:id', component: CourseInfoPage },
      { path: 'new-course', component: CourseInfoPage },
      { path: 'search-course', component: SearchCoursePage },
      { path: 'search-course-result', component: SearchCourseResultPage },
      { path: 'course-record-template', component: CourseRecordTemplatePage },

      { path: 'campuses', component: CampusesPage },
      { path: 'campus-info/:id', component: CampusDetailsPage },
      { path: 'new-campus', component: CampusDetailsPage },
      { path: 'campus-record-template', component: CampusRecordTemplatePage },

      { path: 'programs', component: ProgramsPage },
      { path: 'program-info/:id', component: ProgramInfoPage },
      { path: 'new-program', component: ProgramInfoPage },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizationRoutingModule {}
