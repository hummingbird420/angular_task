export interface CampusInfo {
  campusId: number;
  campusName: string;
  campusCode: string;
  stateLicense: string;
  federalId: string;
  pellId: string;
  campusPhone: string;

  physicalStreet: string;
  physicalCity: string;
  physicalState: string;
  physicalZipcode: string;

  mailingStreet: string;
  mailingCity: string;
  mailingState: string;
  mailingZipcode: string;
  isDataExchangeable: number;

  isActive: number;
  adminId: number;
}
