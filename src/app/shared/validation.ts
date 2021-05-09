
export class Validation {
  public static MESSAGES = {
    required: '{{fieldName}} is required.',
    maxlength: '{{fieldName}} length ({{actualLength}}) exceeds maximum of {{requiredLength}}',
    pattern: '{{fieldName}} contains invalid characters.'
  }
}
