package org.mk.ebankingbackend.services;

import org.mk.ebankingbackend.entities.BankAccount;
import org.mk.ebankingbackend.entities.CurrentAccount;
import org.mk.ebankingbackend.entities.Customer;
import org.mk.ebankingbackend.entities.SavingAccount;
import org.mk.ebankingbackend.exceptions.BalanceNotSufficientException;
import org.mk.ebankingbackend.exceptions.BankAccountNotFoundException;
import org.mk.ebankingbackend.exceptions.CustomerNotFoundException;

import java.util.List;

public interface BankAccountService {
     Customer saveCustomer(Customer customer);

     CurrentAccount saveCurrentBankAccount(double initialBalance, double overDraft, Long CustomerId ) throws CustomerNotFoundException;
     SavingAccount saveSavingBankAccount(double initialBalance, double InterestRate, Long CustomerId ) throws CustomerNotFoundException;

     List<Customer> listCustomers();
     BankAccount getBankAccount(String accountId) throws BankAccountNotFoundException;

     BankAccount getBankAccountById(String accountId) throws BankAccountNotFoundException;

     void debit(String accountId, double amount , String description) throws BankAccountNotFoundException, BalanceNotSufficientException;
     void credit(String accountId, double amount ,String description) throws BankAccountNotFoundException;
     void transfer(String accountIdSource , String accountIdDestination, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException;

}
