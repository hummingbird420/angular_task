import { PairValue } from './pair-value';

export interface SortedFieldInfo<V, ID> {
  sortId: ID;
  fieldTitle: string;
  fieldName: string;
  fieldValue: V;
  fieldType: string;
  customFieldId: string;
  hints: string;
  options: PairValue<V, string>[];
  maxLength: number;
}
