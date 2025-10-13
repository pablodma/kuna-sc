package com.kavak.financingoffer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ofertas_financiamiento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaFinanciamiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "user_id")
    private UUID userId;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String apellido;
    
    @Column(nullable = false)
    private String dni;
    
    @Column(name = "ingresos_anuales", nullable = false)
    private BigDecimal ingresosAnuales;
    
    @Column(nullable = false)
    private String marca;
    
    @Column(nullable = false)
    private String modelo;
    
    @Column(nullable = false)
    private String version;
    
    @Column(nullable = false)
    private Integer anio;
    
    @Column(nullable = false)
    private String sku;
    
    @Column(name = "monto_total_auto", nullable = false)
    private BigDecimal montoTotalAuto;
    
    @Column(name = "porcentaje_financiar", nullable = false)
    private Integer porcentajeFinanciar;
    
    @Column(name = "monto_financiado", nullable = false)
    private BigDecimal montoFinanciado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    // Campos adicionales para integración con CRM
    @Column(name = "deal_id")
    private String dealId;
    
    @Column(name = "subsidiary")
    private Integer subsidiary;
    
    @Column(name = "country")
    private String country;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}

