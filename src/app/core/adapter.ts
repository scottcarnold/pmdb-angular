export interface Adapter<T> {
  adapt(item: any): T;
  format(item: T): any;
}
