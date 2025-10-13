package com.kavak.financingoffer.controller;

import com.kavak.financingoffer.dto.FinancingOfferRequest;
import com.kavak.financingoffer.dto.SimulacionResponse;
import com.kavak.financingoffer.service.FinancingOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financing-offers")
@RequiredArgsConstructor
public class FinancingOfferController {
    
    private final FinancingOfferService financingOfferService;
    
    @PostMapping
    public ResponseEntity<SimulacionResponse> crearSimulacion(
            @Valid @RequestBody FinancingOfferRequest request,
            Authentication authentication) {
        
        SimulacionResponse response = financingOfferService.crearSimulacion(request, authentication);
        return ResponseEntity.ok(response);
    }
}






