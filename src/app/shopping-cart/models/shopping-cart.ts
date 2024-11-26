export interface HeaderFooterInfo {
  header: string;
  footer: string;
}

export interface ColumnInfo {
  name: string;
  title: string;
  type: string;
  alignment: string;
}
export interface ClassDurationInfo {
  startDate: string;
  endDate: string;
}
export interface ClassInfo {
  classId: number;
  session: string;
  location: string;
  dates: string;
  time: string;
  instructor: string[];
  coordinator: string;
  instructionalHours: number;
  labHours: number;
  labHour: number;
  clinicalHours: number;
  clinicalHour: number;
  lessonDuration: number;
  minimumAge: number;
  seatsAvailable: number;
  tuition: number;
  fees: number;
  price: number;
  statusMessage: string;
  allowToSelectClass: boolean;
  enrollAsWaiting: boolean;
  courseId?: number;
  courseName?: string;
  courseNumber?: string;
  comments?: string;
  hasPassCode: boolean;
  name?: string;
  dateOfBirth?: string;
  email?: string;
  studentName?: string;
}
export interface CourseInfo {
  courseId: number;
  courseName: string;
  courseDescription?: string;
  courseNumber?: string;
  classes: ClassInfo[];
}
export interface CourseGroupInfo {
  courseGroupId: number;
  courseGroupName: number;
  courses: CourseInfo[];
}
export interface CartProgramInfo {
  programId: number;
  programName: string;
  programmeLevelCode: string;
  description: string;
  classGroupId: number;
  classGroupName: string;
  courses: CourseInfo[];
}
export interface CartClassResponse {
  courses: CourseInfo[];
  datatableColumns: ColumnInfo[];
}

export interface CartProgramResponse {
  programs: CartProgramInfo[];
  datatableColumns: ColumnInfo[];
  programInstructions: string;
}

export interface CartSummaryInfo {
  subTotal: number;
  couponCode: string;
  discount: number;
  tuitionTax: number;
  total: number;
}
export interface SettingInfo {
  color: string;
  languageId: number;
  dateFormat: string;
  timeZone: string;
  currencySign: string;
}

export type CartOptions = {
  [key: string]: any;
};

export interface FieldInfo {
  sortId: string;
  fieldTitle: string;
  fieldName: string;
  fieldValue: any;
  hints: string;
  fieldType: string;
  options: Option<any, string>[];
  alignment: string;
  index: number;
  required: boolean;
}
export interface Option<V, T> {
  value: V;
  title: T;
}
export interface CartContactAdditionalInfo {
  title: string;
  additionalInfo: FieldInfo[];
}

export interface CartContactFieldInfo {
  generalFields: FieldInfo[];
  additionalSectionFields: CartContactAdditionalInfo[];
}

export interface FieldSectionInfo {
  tabTitle: string;
  fields: FieldInfo[];
}

export interface ContactStudentInfo {
  contactId: number;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  sex: number;
  homePhone: string;
  cellPhone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  profileFieldValues: { [key: string]: string };
}

export interface PaymentPlanInfo {
  paymentPlanId: number;
  planName: string;
  payments: number;
}

export interface TextBookOrOtherChargeInfo {
  id: number;
  classId: number;
  name: string;
  type: number;
  checked: boolean;
  studentId?: number;
}

export interface CollectPaymentClassInfo extends ClassInfo {
  paymentPlanId: number;
  paymentPlans: PaymentPlanInfo[];
  paymentSchedule: CartPaymentScheduleInfo[];
  textBookOrOtherCharges: TextBookOrOtherChargeInfo[];
  studentId: number;
}

export interface CollectPaymentInfo {
  paymentScreenMessage: string;
  datatableColumns: ColumnInfo[];
  subTotal: number;
  discount: number;
  totalTax: number;
  otherCharges: number;
  total: number;
  todayPayment: number;
  hasDue: boolean;
  textBookOrOtherCharges: TextBookOrOtherChargeInfo[];
  classes: CollectPaymentClassInfo[];
}
export interface ClassInvoiceFirstInstallmentInfo {
  totalPayableAmount: number;
  todayTotalPayableAmount: number;
  otherCharges: number;
  paymentSchedule: CartPaymentScheduleInfo[];
}

export interface StudentRegisterResponseInfo {
  studentId: number;
  totalDue: number;
  message: string;
  alreadyEnrolled: boolean;
  multipleStudentFound: boolean;
}

export interface PreRequisiteCourseInfo {
  courseId: number;
  courseName: string;
  courseNumber: string;
}

export interface CourseDetailsInfo {
  courseId: number;
  courseName: string;
  courseNumber: string;
  courseDescription: string;
  refundPolicyTitle: string;
  refundPolicyDescription: string;
  preRequisiteCourses: PreRequisiteCourseInfo[];
  coRequisiteCourses: PreRequisiteCourseInfo[];
  preRequisiteForCourses: PreRequisiteCourseInfo[];
  coordinatorNameTitle: string;
  coordinatorEmailTitle: string;
  coordinatorName: string;
  coordinatorEmail: string;
  datatableColumns: ColumnInfo[];
  classes: ClassInfo[];
}

export interface ContactStudentResponse {
  studentId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  homePhone: string;
  email: string;
}

export interface CartPaymentScheduleInfo {
  dueDate: string;
  installment: number;
}

export interface CartPaymentPlanMap {
  classId: number;
  paymentPlanId: number;
  studentId: number;
}

export interface CartBillingResponseInfo {
  profileFields: FieldInfo[];
  paymentFields: FieldInfo[];
  paymentMethodFieldInfo: FieldInfo;
  transactionCharge: number;
}

export interface PaymentProcessRequestInfo {
  regType: number;
  paymentMethod: string;

  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  paymentType?: string;
  creditCardType?: string;
  cardHolderName?: string;
  carHoderId?: string;
  ccNumber?: string;
  ccExpMonth?: string;
  ccExpYear?: string;
  ccCode?: string;

  bankAcctName?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankAcctType?: string;

  paymentToken?: string;

  priorityCode?: string;

  payorderNumber?: string;
  purchaseOrderFileId?: number;

  billingName1?: string;
  billingName2?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity1?: string;
  billingState1?: string;
  billingZip1?: string;
  billingPhone1?: string;
  billingEmail1?: string;
  invoiceDeliveryMethod?: string;

  billingName?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingPhone?: string;
  billingEmail?: string;
}

export interface ThankYouMessageInfo {
  header: string;
  title: string;
  body: string;
  customMessage: string;
}

export interface ThankYouPageClientInfo {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  organization: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ThankYouPageOrderReceiptInfo {
  title: string;
  orderIdTitle: string;
  orderId: number;
}

export interface ThankYouPageClassInfo extends ClassInfo {
  classId: number;
  courseId: number;
  name: string;
  session: string;
  course: string;
  location: string;
  dates: string;
  time: string;
  instructor: string[];
  labHours: number;
  clinicalHours: number;
  lessonDuration: number;
  comments: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tuition: number;
  fees: number;
  price: number;
}

export interface ThankYouPageSummaryInfo {
  subTotal: number;
  discount: number;
  tutionTax: number;
  otherCharges: number;
  total: number;
}

export interface ThankYouPageInfo {
  waitingMessage: string;
  columns: ColumnInfo[];
  thankYouPageClasses: ThankYouPageClassInfo[];
  thankYouPageSummaryInfo: ThankYouPageSummaryInfo;
}

export interface ThankYouPagePaymentDetailsInfo {
  title: string;
  date: string;
  paymentMethod: string;
  transactionId: string;
  transactionFee: number;
  paidAmount: number;
  currencyCode: string;
}

export interface CourseDescriptionInfo {
  courseId: number;
  courseName: string;
  courseNumber: string;
  courseDescription: string;
  refundPolicyTitle: string;
  refundPolicyDescription: string;
}

export interface ThankyouPageResponseInfo {
  thankYouMessageInfo: ThankYouMessageInfo;
  thankYouPageClientInfo: ThankYouPageClientInfo;
  thankYouPageOrderReceiptInfo: ThankYouPageOrderReceiptInfo;
  thankYouPageInfo: ThankYouPageInfo;
  thankYouPagePaymentDetailsInfo: ThankYouPagePaymentDetailsInfo;
  courseDescriptions: CourseDescriptionInfo[];
  waitingMessage: string;
  courseDescriptionWaitings: CourseDescriptionInfo[];
}

export interface MADisplayCartStudentInfo {
  index: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  classIds: number[];
}

export interface ForgotPasswordResponse {
  userType: number;
  userId: number;
  message: string;
  fieldInfo: FieldInfo;
}
