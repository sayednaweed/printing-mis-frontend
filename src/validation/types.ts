export type ValidationRule =
  | "required"
  | `max:${number}`
  | `min:${number}`
  | `equal:${number}`
  | ((userData: any) => boolean);
export interface ValidateItem {
  name: string;
  rules: ValidationRule[];
}
