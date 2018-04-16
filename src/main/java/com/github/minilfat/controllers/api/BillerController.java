package com.github.minilfat.controllers.api;


import com.github.minilfat.models.Biller;
import com.github.minilfat.repositories.BillerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BillerController {

    @Autowired
    private BillerRepository billerRepository;

    @RequestMapping("/billers")
    public List<Biller> getBillers() {
        return billerRepository.findAll();
    }

    @PostMapping("/billers")
    public Biller createCustomer(@Valid @RequestBody Biller biller) {
        return billerRepository.save(biller);
    }

    @PutMapping("/billers/{id}")
    public Biller updateCustomer(@PathVariable(value = "id") Long billerId,
                                   @Valid @RequestBody Biller billerDetails) {
        Biller biller = billerRepository.findOne(billerId);

        biller.setCompanyName(billerDetails.getCompanyName());

        return billerRepository.save(biller);
    }

    @DeleteMapping("/billers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable(value = "id") Long customerId) {

        billerRepository.delete(customerId);
        return ResponseEntity.ok().build();
    }


}
