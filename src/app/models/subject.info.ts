export interface SubjectInfo {
  courseId: number;
  teacherId: number;
  courseNumber: string;
  prerequisiteCreditHours: number;
  courseAvailable: number;
  learnerWorldFee: number;

  courseCategoryId: number;
  levelId: number;
  creditUnit: number;
  contEduUnit: number;
  instructHour: number;
  labHour: number;
  clinicalHour: number;
  capacity: number;
  minPercentForCredit: number;
  multipleCreditCount: number;
  subtractPosForUnexcusedAbsence: number;
  subject: string;
  transcriptCourseNumber: string;
  levelName: string;
  description: string;
  coordinatorId: number;
  teacherName: string;
  gradingType: number;
  transcriptAssocType: number;
  prerequisiteType: number;
  duration: string;
  expireAfterMonths: number;
  courseType: number;

  curriculumId: number;
  masterCourseId: number;

  textColor: string;

  minimumAge: number;
  refundPolicyId: number;
  faUnit: number;
  createAssignmentFromTestCategory: number;
}
