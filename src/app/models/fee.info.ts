interface FeeInfo {
  semesterId: number;
  feeName: string;
  fee: number;
  isTaxable: string;
  t1098: number;
  isRpp: number;
  isFa: number;
  glCode: string;
  billingCodeId: number;
}

interface SeparateFeeInfo extends FeeInfo {
  isSeparatePayment: number;
}

interface CurriculumInfo {
  curriculumId: number;
  curriculumName: string;
}

export interface CourseFeeInfo extends SeparateFeeInfo, CurriculumInfo {
  courseFeeId: number;
  batchNumber: string;
  courseId: number;
  courseName: string;
}

export interface DepartmentCourseFeeInfo
  extends SeparateFeeInfo,
    CurriculumInfo {
  levelCourseFeeId: number;
  courseId: number;
  courseName: string;
  levelId: number;
}

export interface DepartmentFeeInfo extends SeparateFeeInfo, CurriculumInfo {
  departmentFeeId: number;
  levelId: number;
  batchNumber: string;
}

export interface ProgramFeeInfo extends SeparateFeeInfo, CurriculumInfo {
  programmeFeeId: number;
  levelId: number;
  programmeId: number;
  programmeCode: number;
  programName: string;
  programmeLevelId: number;
  programmeLevelCode: string;
  batchNumber: string;
  isOneTimeFee: number;
}

export interface IndividualFeeInfo extends FeeInfo {
  feeStudentReltnId: number;
  feeId: number;
  classId: number;
  paymentSetup: number;
  feeType: number;
  studentCanAdd: string;
  feeNote: string;
  dueDate: string;
}

export interface UniversalFeeInfo extends SeparateFeeInfo {
  universalFeeId: number;
}

export interface OneTimeFeeInfo extends SeparateFeeInfo {
  oneTimeFeeId: number;
  programmeId: number;
}

export interface InstallmentFeeInfo {
  installmentFeeId: number;
  semesterId: number;
  paymentPlanId: number;
  fee: number;
  isFirstTime: number;
  gLCode: string;
  billingCodeId: number;
}
