import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employee.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatPaginator, MatSort, MatSortModule, MatButton, MatTooltip],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchControl = new FormControl(''); // Search input control
  dataSource = new MatTableDataSource<Employee>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.loadEmployees();
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.applyFilter(searchTerm || '');
      });
  }

  //Adding the data to sort and paginator
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  //Applying filter
  applyFilter(searchTerm: string) {
    if (this.dataSource) {
      this.dataSource.filter = searchTerm.trim().toLowerCase();
    }
  }

  //Loading employees from service
  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  //Filtering employees
  filterEmployees(searchTerm: string): Employee[] {
    if (!searchTerm) return this.employees;
    searchTerm = searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.position.toLowerCase().includes(searchTerm)
    );
  }

  //Opening add dialog
  openAddDialog() {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '1600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.addEmployee(result);
        this.loadEmployees();
      }
    });
  }

  //Opening edit dialog
  openEditDialog(employee: Employee) {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: { employee },
      width: '1600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.updateEmployee(result);
        this.loadEmployees();
      }
    });
  }

  //Deleting employee
  deleteEmployee(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.deleteEmployee(id);
        this.loadEmployees();
      }
    });
  }
}
