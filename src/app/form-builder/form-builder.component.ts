import { Component } from '@angular/core';
import { FormField } from '../models/form-field';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent {
  fieldTypes = ['text', 'textarea', 'dropdown', 'checkbox', 'radio'];
  selectedType: FormField['type'] = 'text';
  label = '';
  placeholder = '';
  required = false;
  options = '';
  formFields: FormField[] = [];

  constructor(private formService: FormService) {
    this.formService.formFields$.subscribe(fields => {
      this.formFields = fields;
    });
  }

  addField(): void {
    if (this.label.trim()) {
      const newField: FormField = {
        type: this.selectedType,
        label: this.label,
        placeholder: this.placeholder,
        required: this.required,
        options: this.options.split(',').map(opt => opt.trim()),
        id: ''
      };
      this.formService.addField(newField);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.label = '';
    this.placeholder = '';
    this.required = false;
    this.options = '';
  }
}