package org.mk.ebankingbackend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mk.ebankingbackend.entities.BankAccount;
import org.mk.ebankingbackend.entities.CurrentAccount;
import org.mk.ebankingbackend.entities.Customer;
import org.mk.ebankingbackend.entities.SavingAccount;
import org.mk.ebankingbackend.repositories.AccountOperationRepository;
import org.mk.ebankingbackend.repositories.BankAccountRepository;
import org.mk.ebankingbackend.repositories.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class BankAccountServiceImpl implements BankAccountService {

    private CustomerRepository customerRepository;

    private BankAccountRepository bankAccountRepository;

    private AccountOperationRepository accountOperationRepository;

    @Override
    public Customer saveCustomer(Customer customer) {
        log.info("Saving new customer ");
        Customer savedCustomer= customerRepository.save(customer);
        return savedCustomer;
    }

    @Override
    public BankAccount saveBankAccount(double initialBalance, String type, Long CustomerId) {
        Customer customer = customerRepository.findById(CustomerId).orElse(null);
        if(customer == null)
            throw new RuntimeException("Customer not found");
        BankAccount bankAccount;
        if(type.equals("current")){
            bankAccount = new CurrentAccount();

        } else {
            bankAccount = new SavingAccount();

        }
        bankAccount.setId(UUID.randomUUID().toString());
        bankAccount.setCreatedAt(new Date());
        bankAccount.setBalance(initialBalance);

        return null;
    }

    @Override
    public List<Customer> listCustomers() {
        return List.of();
    }

    @Override
    public BankAccount getBankAccountById(String accountId) {
        return null;
    }

    @Override
    public void debit(String accountId, double amount, String description) {

    }

    @Override
    public void credit(String accountId, double amount, String description) {

    }

    @Override
    public void transfer(String accountIdSource, String accountIdDestination, double amount) {

    }
}
