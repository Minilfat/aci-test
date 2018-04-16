package com.github.minilfat.controllers.api;


import com.github.minilfat.models.Customer;
import com.github.minilfat.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/customers")
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping("/customers")
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    @PutMapping("/customers/{id}")
    public Customer updateCustomer(@PathVariable(value = "id") Long customerId,
                           @Valid @RequestBody Customer customerDetails) {

        Customer customer = customerRepository.findOne(customerId);

        customer.setAddress(customerDetails.getAddress());
        customer.setDateOfBirth(customerDetails.getDateOfBirth());
        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());

        return customerRepository.save(customer);
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable(value = "id") Long customerId) {

        customerRepository.delete(customerId);
        return ResponseEntity.ok().build();
    }
}
