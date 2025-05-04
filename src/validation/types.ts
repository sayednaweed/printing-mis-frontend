export type ValidationRule =
  | "required"
  | `requiredIf:${string}:${boolean}`
  | `max:${number}`
  | `min:${number}`
  | `equal:${number}`
  | ((value: any) => boolean);
export interface ValidateItem {
  name: string;
  rules: ValidationRule[];
}
