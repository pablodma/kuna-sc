package com.kavak.sc.oferta.service;

import com.kavak.sc.oferta.dto.FinancingOfferRequest;
import com.kavak.sc.oferta.dto.SimulacionResponse;
import com.kavak.sc.oferta.entity.AjustesSistema;
import com.kavak.sc.oferta.entity.OfertaFinanciamiento;
import com.kavak.sc.oferta.repository.OfertaFinanciamientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinancingOfferService {
    
    private final OfertaFinanciamientoRepository ofertaRepository;
    private final BeCleverService beCleverService;
    private final AjustesSistemaService ajustesService;
    
    @Value("${app.default.country:AR}")
    private String defaultCountry;
    
    public SimulacionResponse crearSimulacion(FinancingOfferRequest request, Authentication authentication) {
        // Determinar país (del request o default)
        String countryCode = request.getCountry() != null ? request.getCountry() : defaultCountry;
        
        // Validar que el porcentaje no exceda el máximo del sistema para este país
        AjustesSistema settings = ajustesService.getCurrentSettings(countryCode);
        if (request.getPorcentajeFinanciar() > settings.getPorcentajeMaximoFinanciar()) {
            throw new RuntimeException("El porcentaje a financiar excede el máximo permitido: " + 
                    settings.getPorcentajeMaximoFinanciar() + "%");
        }
        
        // Obtener usuario actual
        UUID userId = UUID.fromString(authentication.getName());
        
        // Generar simulación con BeClever
        SimulacionResponse simulacion = beCleverService.simularCredito(
                calcularMontoFinanciado(request)
        );
        
        // Guardar oferta en base de datos
        OfertaFinanciamiento oferta = new OfertaFinanciamiento();
        oferta.setCreatedBy(userId);
        oferta.setClienteNombre(request.getCliente().getNombre());
        oferta.setClienteApellido(request.getCliente().getApellido());
        oferta.setClienteDni(request.getCliente().getDni());
        oferta.setClienteIngresosAnuales(request.getCliente().getIngresosAnuales());
        oferta.setVehiculoMarca(request.getVehiculo().getMarca());
        oferta.setVehiculoModelo(request.getVehiculo().getModelo());
        oferta.setVehiculoVersion(request.getVehiculo().getVersion());
        oferta.setVehiculoAnio(request.getVehiculo().getAnio());
        oferta.setVehiculoSku(request.getVehiculo().getSku());
        oferta.setMontoTotal(simulacion.getMontoTotal());
        oferta.setPorcentajeFinanciar(request.getPorcentajeFinanciar());
        oferta.setMontoFinanciado(simulacion.getMontoFinanciado());
        oferta.setCountryCode(countryCode);
        oferta.setDealId(request.getDealId());
        oferta.setSubsidiary(request.getSubsidiary());
        oferta.setCountry(request.getCountry());
        
        ofertaRepository.save(oferta);
        
        return simulacion;
    }
    
    private BigDecimal calcularMontoFinanciado(FinancingOfferRequest request) {
        // En un escenario real, esto vendría del precio del vehículo
        // Por ahora usamos el monto total generado por BeClever
        BigDecimal montoTotal = beCleverService.simularCredito(BigDecimal.ZERO).getMontoTotal();
        return montoTotal.multiply(BigDecimal.valueOf(request.getPorcentajeFinanciar()))
                .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
    }
}






