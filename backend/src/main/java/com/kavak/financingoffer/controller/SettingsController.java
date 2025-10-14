package com.kavak.financingoffer.controller;

import com.kavak.financingoffer.dto.SettingsRequest;
import com.kavak.financingoffer.entity.AjustesSistema;
import com.kavak.financingoffer.service.AjustesSistemaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    
    private final AjustesSistemaService ajustesService;
    
    @GetMapping
    public ResponseEntity<AjustesSistema> getSettings() {
        AjustesSistema settings = ajustesService.getCurrentSettings();
        return ResponseEntity.ok(settings);
    }
    
    @PatchMapping
    public ResponseEntity<AjustesSistema> updateSettings(
            @Valid @RequestBody SettingsRequest request) {
        
        AjustesSistema updatedSettings = ajustesService.updatePorcentajeMaximo(
                request.getPorcentajeMaximo());
        
        return ResponseEntity.ok(updatedSettings);
    }
}






