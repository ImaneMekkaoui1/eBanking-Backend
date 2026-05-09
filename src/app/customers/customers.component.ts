import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';

import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });
    this.handleSearchCustomers();
  }

  handleSearchCustomers(): void {
    const kw = this.searchFormGroup.value.keyword ?? '';
    this.errorMessage = '';
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err?.message || 'Error loading customers';
        return throwError(() => err);
      })
    );
  }

  handleDeleteCustomer(c: Customer): void {
    const conf = confirm('Are you sure?');
    if (!conf) {
      return;
    }

    this.customerService.deleteCustomer(c.id).subscribe({
      next: () => {
        this.customers = this.customers.pipe(
          map(data => data.filter(customer => customer.id !== c.id))
        );
      },
      error: err => {
        console.error(err);
      }
    });
  }

  handleCustomerAccounts(customer: Customer): void {
    this.router.navigateByUrl('/customer-accounts/' + customer.id, { state: customer });
  }
}
