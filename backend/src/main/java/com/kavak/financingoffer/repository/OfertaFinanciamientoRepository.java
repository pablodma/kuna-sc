package com.kavak.financingoffer.repository;

import com.kavak.financingoffer.entity.OfertaFinanciamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfertaFinanciamientoRepository extends JpaRepository<OfertaFinanciamiento, UUID> {
    List<OfertaFinanciamiento> findByUserId(UUID userId);
    List<OfertaFinanciamiento> findByDealId(String dealId);
}

