import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormField } from '../models/form-field';
import { v4 as uuidv4 } from 'uuid'; // Install uuid: npm install uuid

@Injectable({ providedIn: 'root' }) 
export class FormService {
  private formFields: FormField[] = [];
  private formFieldsSubject = new BehaviorSubject<FormField[]>([]);
  formFields$ = this.formFieldsSubject.asObservable();

  getFields(): FormField[] {
    return this.formFields;
  }

  addField(field: FormField): void {
    field.id = uuidv4(); // Generate unique ID
    this.formFields.push(field);
    this.formFieldsSubject.next([...this.formFields]);
  }

  removeField(id: string): void {
    this.formFields = this.formFields.filter(field => field.id !== id);
    this.formFieldsSubject.next([...this.formFields]);
  }

  clearForm(): void {
    this.formFields = [];
    this.formFieldsSubject.next([]);
  }
}