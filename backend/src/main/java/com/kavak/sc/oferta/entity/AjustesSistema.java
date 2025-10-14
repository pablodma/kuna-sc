package com.kavak.sc.oferta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ajustes_sistema")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AjustesSistema {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "porcentaje_maximo", nullable = false)
    private Integer porcentajeMaximoFinanciar;
    
    @Column(name = "actualizado_por", nullable = false)
    private String actualizadoPor;
    
    @Column(name = "country_code", nullable = false, length = 2)
    private String countryCode;
    
    @Column(name = "timestamp")
    private LocalDateTime updatedAt;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

