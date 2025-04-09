import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormField } from '../models/form-field';
import { FormService } from '../services/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  fields: FormField[] = [];
  form: FormGroup;

  constructor(
    private formService: FormService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.formService.formFields$.subscribe(fields => {
      this.fields = fields;
      this.buildForm();
    });
  }

  private buildForm(): void {
    const formGroup: any = {};

    this.fields.forEach(field => {
      if (field.type === 'checkbox') {
        const checkboxGroup: any = {};
        field.options?.forEach(option => {
          checkboxGroup[option] = new FormControl(false);
        });
        formGroup[field.label] = this.fb.group(checkboxGroup);
      } else {
        formGroup[field.label] = new FormControl(
          field.type === 'dropdown' && field.required && field.options?.length ? field.options[0] : null,
          field.required ? Validators.required : null
        );
      }
    });

    this.form = this.fb.group(formGroup);
  }

  removeField(id: string): void {
    this.formService.removeField(id);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.getFormData();
      console.log('Form Data:', formData);
      this.snackBar.open('Form submitted successfully!', 'Close', { duration: 3000 });
      this.form.reset();
    } else {
      this.markFormGroupTouched(this.form);
      this.snackBar.open('Please fill all required fields!', 'Close', { duration: 3000 });
    }
  }

  private getFormData(): any {
    const formValue = { ...this.form.value };
    
    this.fields.forEach(field => {
      if (field.type === 'checkbox') {
        const checkboxGroup = this.form.get(field.label) as FormGroup;
        const selectedOptions = Object.keys(checkboxGroup.controls)
          .filter(key => checkboxGroup.get(key)?.value);
        formValue[field.label] = selectedOptions;
      }
    });

    return {
      formFields: this.fields.map(field => ({
        type: field.type,
        label: field.label,
        value: formValue[field.label],
        required: field.required
      })),
      rawData: formValue
    };
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}