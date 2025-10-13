package com.kavak.financingoffer.service;

import com.kavak.financingoffer.dto.FinancingOfferRequest;
import com.kavak.financingoffer.dto.SimulacionResponse;
import com.kavak.financingoffer.entity.AjustesSistema;
import com.kavak.financingoffer.entity.OfertaFinanciamiento;
import com.kavak.financingoffer.repository.OfertaFinanciamientoRepository;
import lombok.RequiredArgsConstructor;
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
    
    public SimulacionResponse crearSimulacion(FinancingOfferRequest request, Authentication authentication) {
        // Validar que el porcentaje no exceda el máximo del sistema
        AjustesSistema settings = ajustesService.getCurrentSettings();
        if (request.getPorcentajeFinanciar() > settings.getPorcentajeMaximo()) {
            throw new RuntimeException("El porcentaje a financiar excede el máximo permitido: " + 
                    settings.getPorcentajeMaximo() + "%");
        }
        
        // Obtener usuario actual
        UUID userId = UUID.fromString(authentication.getName());
        
        // Generar simulación con BeClever
        SimulacionResponse simulacion = beCleverService.simularCredito(
                calcularMontoFinanciado(request)
        );
        
        // Guardar oferta en base de datos
        OfertaFinanciamiento oferta = new OfertaFinanciamiento();
        oferta.setUserId(userId);
        oferta.setNombre(request.getCliente().getNombre());
        oferta.setApellido(request.getCliente().getApellido());
        oferta.setDni(request.getCliente().getDni());
        oferta.setIngresosAnuales(request.getCliente().getIngresosAnuales());
        oferta.setMarca(request.getVehiculo().getMarca());
        oferta.setModelo(request.getVehiculo().getModelo());
        oferta.setVersion(request.getVehiculo().getVersion());
        oferta.setAnio(request.getVehiculo().getAnio());
        oferta.setSku(request.getVehiculo().getSku());
        oferta.setMontoTotalAuto(simulacion.getMontoTotal());
        oferta.setPorcentajeFinanciar(request.getPorcentajeFinanciar());
        oferta.setMontoFinanciado(simulacion.getMontoFinanciado());
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






