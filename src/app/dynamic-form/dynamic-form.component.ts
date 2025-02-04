import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  form: FormGroup = new FormGroup({});

  constructor(
    private formService: FormService,
    private snackBar: MatSnackBar
  ) {
    this.formService.formFields$.subscribe(fields => {
      this.fields = fields;
      this.createForm();
    });
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = new FormGroup({}); // Reset the form group
    this.fields.forEach(field => {
      this.form.addControl(
        field.label,
        new FormControl('', field.required ? Validators.required : null)
      );
    });
  }

  removeField(id: string): void {
    this.formService.removeField(id);
    this.createForm(); // Rebuild the form after removal
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      this.snackBar.open('Form submitted successfully!', 'Close', { duration: 3000 });
      this.form.reset();
      this.formService.clearForm(); // Clear the form after submission
    } else {
      this.snackBar.open('Please fill all required fields!', 'Close', { duration: 3000 });
    }
  }
}