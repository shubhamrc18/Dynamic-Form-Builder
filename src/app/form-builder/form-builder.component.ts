import { Component } from '@angular/core';
import { FormField } from '../models/form-field';
import { FormService } from '../services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private formService: FormService,
    private snackBar: MatSnackBar
  ) {}

  isFormValid(): boolean {
    if (!this.label.trim()) return false;
    if (['dropdown', 'radio', 'checkbox'].includes(this.selectedType)) {
      return !!this.options.trim();
    }
    return true;
  }

  addField(): void {
    if (!this.isFormValid()) {
      this.snackBar.open('Please fill all required fields!', 'Close', { duration: 3000 });
      return;
    }

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

  private resetForm(): void {
    this.label = '';
    this.placeholder = '';
    this.required = false;
    this.options = '';
  }
}