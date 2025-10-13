package com.kavak.financingoffer.service;

import com.kavak.financingoffer.dto.SimulacionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BeCleverService {
    
    private final Random random = new Random();
    
    public SimulacionResponse simularCredito(BigDecimal montoFinanciado) {
        // Generar monto total aleatorio entre $5M y $20M ARS
        BigDecimal montoTotal = generarMontoTotal();
        
        // Generar simulaciones para diferentes plazos
        List<SimulacionResponse.Simulacion> simulaciones = generarSimulaciones(montoFinanciado);
        
        return new SimulacionResponse(montoTotal, montoFinanciado, simulaciones);
    }
    
    private BigDecimal generarMontoTotal() {
        // Generar entre 5,000,000 y 20,000,000 ARS
        int min = 5000000;
        int max = 20000000;
        int monto = random.nextInt(max - min + 1) + min;
        return new BigDecimal(monto);
    }
    
    private List<SimulacionResponse.Simulacion> generarSimulaciones(BigDecimal montoFinanciado) {
        List<SimulacionResponse.Simulacion> simulaciones = new ArrayList<>();
        
        // Plazos de 12 a 84 meses (incremento de 6)
        int[] plazos = {12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84};
        
        for (int meses : plazos) {
            SimulacionResponse.Simulacion simulacion = generarSimulacionParaPlazo(montoFinanciado, meses);
            simulaciones.add(simulacion);
        }
        
        return simulaciones;
    }
    
    private SimulacionResponse.Simulacion generarSimulacionParaPlazo(BigDecimal montoFinanciado, int meses) {
        // TNA entre 70% y 90%
        double tna = 70 + random.nextDouble() * 20;
        
        // Calcular TAE (Tasa Anual Efectiva)
        double tae = calcularTAE(tna);
        
        // Calcular cuota mensual usando fórmula de cuota fija
        BigDecimal cuotaMensual = calcularCuotaMensual(montoFinanciado, tna / 100, meses);
        
        return new SimulacionResponse.Simulacion(
                meses,
                cuotaMensual,
                BigDecimal.valueOf(tna).setScale(1, RoundingMode.HALF_UP),
                BigDecimal.valueOf(tae).setScale(1, RoundingMode.HALF_UP)
        );
    }
    
    private double calcularTAE(double tna) {
        // Fórmula simplificada para TAE
        // TAE = (1 + TNA/12)^12 - 1
        return (Math.pow(1 + tna / 1200, 12) - 1) * 100;
    }
    
    private BigDecimal calcularCuotaMensual(BigDecimal monto, double tasaMensual, int meses) {
        // Fórmula de cuota fija: C = P * [r(1+r)^n] / [(1+r)^n - 1]
        // donde P = monto, r = tasa mensual, n = número de meses
        
        double r = tasaMensual / 100;
        double factor = Math.pow(1 + r, meses);
        double cuota = monto.doubleValue() * (r * factor) / (factor - 1);
        
        return BigDecimal.valueOf(cuota).setScale(0, RoundingMode.HALF_UP);
    }
}




