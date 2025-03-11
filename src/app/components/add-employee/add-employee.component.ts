import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee.model';
@Component({
  standalone: true,
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOption,
  ],
})

export class AddEmployeeComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddEmployeeComponent>);
  employeeForm!: FormGroup;
  positions: string[] = [
    'Manager',
    'Developer',
    'Designer',
    'Sales',
    'HR',
    'QA Engineer',
    'DevOps Engineer',
    'Product Manager',
    'Support Engineer',
    'Frontend Developer',
    'Backend Developer'
  ]; 
  title: string;
  originalEmployee: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { employee?: Employee }) {
    this.title = data?.employee ? 'Edit Employee' : 'Add Employee';
  }

  ngOnInit() {
    // Create a deep copy of the employee object
    this.originalEmployee = this.data?.employee ? JSON.parse(JSON.stringify(this.data.employee)) : null;
  
    // Initialize form with the copied data
    this.employeeForm = new FormGroup({
      name: new FormControl(this.originalEmployee?.name || '', [Validators.required, Validators.minLength(3)]),
      position: new FormControl(this.originalEmployee?.position || '', Validators.required),
      salary: new FormControl(this.originalEmployee?.salary || '', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
    });
  }
  

  submit() {
    if (this.employeeForm.valid) {
      this.dialogRef.close({ ...this.data?.employee, ...this.employeeForm.value });
    }
  }

  close():void  {
    if (this.originalEmployee) {
      this.employeeForm.patchValue(this.originalEmployee);
    }
    this.dialogRef.close();  }
}
