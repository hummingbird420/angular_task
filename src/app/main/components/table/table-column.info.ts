export interface TableColumnInfo {
  name: string;
  title: string;
  type: string;
  alignment: 'LEFT' | 'CENTER' | 'RIGHT';
  cell: Function;
  link: Function;
  action?: Function;
}
