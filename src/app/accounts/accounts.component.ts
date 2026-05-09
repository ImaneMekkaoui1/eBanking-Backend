import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';

import { AccountsService } from '../services/accounts.service';
import { AccountDetails } from '../model/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accountFormGroup!: FormGroup;
  accountObservable!: Observable<AccountDetails>;
  operationFromGroup!: FormGroup;

  currentPage: number = 0;
  pageSize: number = 5;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountsService
  ) {}

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: ['']
    });

    this.operationFromGroup = this.fb.group({
      operationType: [null],
      amount: [0],
      description: [null],
      accountDestination: [null]
    });
  }

  handleSearchAccount(): void {
    this.errorMessage = '';
    const accountId: string = this.accountFormGroup.value.accountId;

    this.accountObservable = this.accountService.getAccount(
      accountId,
      this.currentPage,
      this.pageSize
    ).pipe(
      catchError((err: any) => {
        this.errorMessage = err.message || 'Error loading account';
        return throwError(() => err);
      })
    );
  }

  handleAccountOperation(): void {
    this.errorMessage = '';
    const accountId: string = this.accountFormGroup.value.accountId;
    const operationType: string = this.operationFromGroup.value.operationType;
    const amount: number = Number(this.operationFromGroup.value.amount);
    const description: string = this.operationFromGroup.value.description ?? '';
    const destination: string = this.operationFromGroup.value.accountDestination;

    if (!accountId) {
      this.errorMessage = 'Please enter an account ID first.';
      return;
    }
    if (!operationType) {
      this.errorMessage = 'Please choose an operation type.';
      return;
    }
    if (amount <= 0) {
      this.errorMessage = 'Amount must be greater than zero.';
      return;
    }
    if (operationType === 'TRANSFER' && !destination) {
      this.errorMessage = 'Please enter a destination account for transfer.';
      return;
    }

    let operation$ = this.accountService.debit(accountId, amount, description);
    if (operationType === 'CREDIT') {
      operation$ = this.accountService.credit(accountId, amount, description);
    } else if (operationType === 'TRANSFER') {
      operation$ = this.accountService.transfer(accountId, destination, amount, description);
    }

    operation$.subscribe({
      next: () => this.gotoPage(this.currentPage),
      error: (err: any) => {
        this.errorMessage = err?.message || 'Error saving operation';
      }
    });
  }

  gotoPage(page: number): void {
    this.currentPage = page;
    this.handleSearchAccount();
  }
}
