export interface FormField {
    id: string; // Add unique ID
    type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  }