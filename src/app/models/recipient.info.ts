export interface NavigationField {
  selectedIndex: number;
  breadcrumbUrls: {
    name: string;
    path: string;
    index: number;
  }[];
}
export interface Columns {
  name: string;
  title: string;
  type: string;
  alignment: string;
}

export interface Recipients {
  selectionField: {
    fieldTitle: string;
    fieldName: string;
    fieldValue: { userId: number; userRole: number; name: string; userRoleName: string };
    fieldType: string;
    hints: string | null;
    maxLength: number;
    required: boolean;
    options: [] | null;
  };
  idNumber: string;
  name: string;
  homePhone: string;
  cellPhone: string;
  email: string;
  relations: [];
}

export interface RecipientInfo {
  navigationField: NavigationField;
  buttons: {
    fieldTitle: string;
    fieldName: string;
    fieldValue: string;
    fieldType: string;
    hints: string | null;
    maxLength: number;
    required: boolean;
    options: [] | null;
  }[];
  addStudentsFromAllPagesSelectionField: [] | null;
  columns: Columns[];
  allSelectionField: {
    fieldTitle: string;
    fieldName: string;
    fieldValue: string;
    fieldType: string;
    hints: string | null;
    maxLength: number;
    required: boolean;
    options: [] | null;
  };
  allrelationSelectionField: {
    fieldTitle: string;
    fieldName: string;
    fieldValue: string;
    fieldType: string;
    hints: string | null;
    maxLength: number;
    required: boolean;
    options: [] | null;
  };
  studentRecipients: Recipients[];
}
