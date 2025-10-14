package com.kavak.financingoffer.entity;

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
    private Integer porcentajeMaximo;
    
    @Column(name = "actualizado_por", nullable = false)
    private String actualizadoPor;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        timestamp = LocalDateTime.now();
    }
}

