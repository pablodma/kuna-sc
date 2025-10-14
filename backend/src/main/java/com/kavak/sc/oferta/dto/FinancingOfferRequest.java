package com.kavak.sc.oferta.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
public class FinancingOfferRequest {
    
    @Valid
    @NotNull(message = "Cliente data is required")
    private Cliente cliente;
    
    @Valid
    @NotNull(message = "Vehículo data is required")
    private Vehiculo vehiculo;
    
    @NotNull(message = "Porcentaje a financiar is required")
    @Min(value = 1, message = "Porcentaje must be at least 1%")
    @Max(value = 100, message = "Porcentaje cannot exceed 100%")
    private Integer porcentajeFinanciar;
    
    // Campos adicionales para integración con CRM
    private String dealId;
    private Integer subsidiary;
    private String country;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Cliente {
        @NotBlank(message = "Nombre is required")
        private String nombre;
        
        @NotBlank(message = "Apellido is required")
        private String apellido;
        
        @NotBlank(message = "DNI is required")
        private String dni;
        
        @NotNull(message = "Ingresos anuales is required")
        @DecimalMin(value = "0.0", message = "Ingresos must be positive")
        private BigDecimal ingresosAnuales;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Vehiculo {
        @NotBlank(message = "Marca is required")
        private String marca;
        
        @NotBlank(message = "Modelo is required")
        private String modelo;
        
        @NotBlank(message = "Versión is required")
        private String version;
        
        @NotNull(message = "Año is required")
        @Min(value = 1990, message = "Año must be 1990 or later")
        @Max(value = 2025, message = "Año cannot be in the future")
        private Integer anio;
        
        @NotBlank(message = "SKU is required")
        private String sku;
    }
}






