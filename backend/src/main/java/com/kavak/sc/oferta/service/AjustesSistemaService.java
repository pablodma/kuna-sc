package com.kavak.sc.oferta.service;

import com.kavak.sc.oferta.entity.AjustesSistema;
import com.kavak.sc.oferta.repository.AjustesSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AjustesSistemaService {
    
    private final AjustesSistemaRepository ajustesRepository;
    
    @Value("${app.default.country:AR}")
    private String defaultCountry;
    
    public AjustesSistema getCurrentSettings() {
        return getCurrentSettings(defaultCountry);
    }
    
    public AjustesSistema getCurrentSettings(String countryCode) {
        AjustesSistema settings = ajustesRepository.findTopByCountryCodeOrderByUpdatedAtDesc(countryCode);
        if (settings == null) {
            // Crear configuración inicial si no existe
            settings = new AjustesSistema();
            settings.setPorcentajeMaximoFinanciar(50);
            settings.setCountryCode(countryCode);
            settings.setActualizadoPor("system");
            settings = ajustesRepository.save(settings);
        }
        return settings;
    }
    
    public AjustesSistema updatePorcentajeMaximo(Integer porcentajeMaximo) {
        return updatePorcentajeMaximo(porcentajeMaximo, defaultCountry);
    }
    
    public AjustesSistema updatePorcentajeMaximo(Integer porcentajeMaximo, String countryCode) {
        AjustesSistema settings = new AjustesSistema();
        settings.setPorcentajeMaximoFinanciar(porcentajeMaximo);
        settings.setCountryCode(countryCode);
        settings.setActualizadoPor("admin");
        return ajustesRepository.save(settings);
    }
}




