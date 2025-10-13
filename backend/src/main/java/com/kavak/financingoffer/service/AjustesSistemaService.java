package com.kavak.financingoffer.service;

import com.kavak.financingoffer.entity.AjustesSistema;
import com.kavak.financingoffer.repository.AjustesSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AjustesSistemaService {
    
    private final AjustesSistemaRepository ajustesRepository;
    
    public AjustesSistema getCurrentSettings() {
        AjustesSistema settings = ajustesRepository.findTopByOrderByTimestampDesc();
        if (settings == null) {
            // Crear configuración inicial si no existe
            settings = new AjustesSistema();
            settings.setPorcentajeMaximo(50);
            settings.setActualizadoPor("system");
            settings = ajustesRepository.save(settings);
        }
        return settings;
    }
    
    public AjustesSistema updatePorcentajeMaximo(Integer porcentajeMaximo, String actualizadoPor) {
        AjustesSistema settings = new AjustesSistema();
        settings.setPorcentajeMaximo(porcentajeMaximo);
        settings.setActualizadoPor(actualizadoPor);
        return ajustesRepository.save(settings);
    }
}




