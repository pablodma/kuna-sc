package com.kavak.sc.oferta.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SettingsRequest {
    
    @NotNull(message = "Porcentaje máximo is required")
    @Min(value = 1, message = "Porcentaje must be at least 1%")
    @Max(value = 100, message = "Porcentaje cannot exceed 100%")
    private Integer porcentajeMaximo;
}






