interface TuitionInfo {
  semesterId: number;
  tuitionRateTypeId: number;
  rate: number;
  glCode: number;
  billingCodeId: number;
}

interface ProgramTuitionRateInfo extends TuitionInfo {
  curriculumId: number;
  curriculumName: string;
  levelId: number;
  departmentName: string;
  batchNumber: string;
  programId: number;
  programCode: string;
  programLevelId: number;
  programLevelCode: string;
}

export interface LessonTuitionRateInfo extends TuitionInfo {
  lessonTuitionRateId: number;
  curriculumId: number;
  curriculumName: string;
  levelId: number;
  departmentName: string;
  subjectId: number;
  courseName: string;
  lessonType: number;
  lessonTypeTitle: string;
}

export interface CourseTuitionRateInfo extends TuitionInfo {
  levelTuitionRateId: number;
  curriculumId: number;
  curriculumName: string;
  levelId: number;
  departmentName: string;
  subjectId: number;
  courseName: string;
  batchNumber: string;
}

export interface CategoryTuitionRateInfo extends TuitionInfo {
  categoryTuitionRateId: number;
  courseCategoryId: number;
  tuitionRates: any;
}

export interface ProgramLevelTuitionRateInfo extends ProgramTuitionRateInfo {
  programmeLevelTuitionRateId: number;
}

export interface ProgramLevelCreditHourTuitionRateInfo
  extends ProgramTuitionRateInfo {
  programmeLevelCreditHourTuitionRateId: number;
}
