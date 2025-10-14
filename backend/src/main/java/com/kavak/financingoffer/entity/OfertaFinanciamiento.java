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
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "cliente_nombre", nullable = false)
    private String clienteNombre;
    
    @Column(name = "cliente_apellido", nullable = false)
    private String clienteApellido;
    
    @Column(name = "cliente_dni", nullable = false)
    private String clienteDni;
    
    @Column(name = "cliente_ingresos_anuales", nullable = false)
    private BigDecimal clienteIngresosAnuales;
    
    @Column(name = "vehiculo_marca", nullable = false)
    private String vehiculoMarca;
    
    @Column(name = "vehiculo_modelo", nullable = false)
    private String vehiculoModelo;
    
    @Column(name = "vehiculo_version", nullable = false)
    private String vehiculoVersion;
    
    @Column(name = "vehiculo_anio", nullable = false)
    private Integer vehiculoAnio;
    
    @Column(name = "vehiculo_sku", nullable = false)
    private String vehiculoSku;
    
    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;
    
    @Column(name = "porcentaje_financiar", nullable = false)
    private Integer porcentajeFinanciar;
    
    @Column(name = "monto_financiado", nullable = false)
    private BigDecimal montoFinanciado;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Campos adicionales para integración con CRM
    @Column(name = "deal_id")
    private String dealId;
    
    @Column(name = "subsidiary")
    private Integer subsidiary;
    
    @Column(name = "country")
    private String country;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

