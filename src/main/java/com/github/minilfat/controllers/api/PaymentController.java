package com.github.minilfat.controllers.api;


import com.github.minilfat.models.Payment;
import com.github.minilfat.repositories.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @RequestMapping("/payments")
    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }


    @PostMapping("/payments")
    public Payment createPayment(@Valid @RequestBody Payment payment) {
        return paymentRepository.save(payment);
    }

}
