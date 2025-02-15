export interface FormField {
  id: string; 
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}