package com.kavak.sc.oferta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulacionResponse {
    private BigDecimal montoTotal;
    private BigDecimal montoFinanciado;
    private List<Simulacion> simulaciones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Simulacion {
        private Integer meses;
        private BigDecimal cuotaMensual;
        private BigDecimal tna;  // Tasa Nominal Anual
        private BigDecimal tae;  // Tasa Anual Efectiva
    }
}


