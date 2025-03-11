import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { catchError, debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesKey = 'employees';
  private jsonUrl = '/employees.json'; // Path to JSON file in public folder

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    const storedEmployees = localStorage.getItem(this.employeesKey);
    if (storedEmployees) {
      return of(JSON.parse(storedEmployees)).pipe(
        debounceTime(300),
        catchError((error) => {
          console.error('Error reading from localStorage:', error);
          return of([]);
        })
      );
    } else {
      return this.http.get<Employee[]>(this.jsonUrl).pipe(
        debounceTime(300),
        map((employees) => {
          localStorage.setItem(this.employeesKey, JSON.stringify(employees));
          return employees;
        }),
        catchError((error) => {
          console.error('Error fetching from JSON:', error);
          return of([]);
        })
      );
    }
  }

  addEmployee(employee: Employee): void {
    const employees = this.getStoredEmployees();
    employee.id = employees.length > 0 ? Math.max(...employees.map((emp) => emp.id || 0)) + 1 : 1;
    employees.push(employee);
    localStorage.setItem(this.employeesKey, JSON.stringify(employees));
  }

  updateEmployee(updatedEmployee: Employee): void {
    const storedEmployees = this.getStoredEmployees();
    const index = storedEmployees.findIndex((emp) => emp.id === updatedEmployee.id);
    if (index !== -1) {
      storedEmployees[index] = updatedEmployee;
    }
    localStorage.setItem(this.employeesKey, JSON.stringify(storedEmployees));
  }

  deleteEmployee(employeeId: number): void {
    const employees = this.getStoredEmployees().filter((emp) => emp.id !== employeeId);
    localStorage.setItem(this.employeesKey, JSON.stringify(employees));
  }

  private getStoredEmployees(): Employee[] {
    const employees = localStorage.getItem(this.employeesKey);
    return employees ? JSON.parse(employees) : [];
  }
}
