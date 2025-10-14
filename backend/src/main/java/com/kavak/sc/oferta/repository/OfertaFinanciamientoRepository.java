package com.kavak.sc.oferta.repository;

import com.kavak.sc.oferta.entity.OfertaFinanciamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfertaFinanciamientoRepository extends JpaRepository<OfertaFinanciamiento, UUID> {
    List<OfertaFinanciamiento> findByCreatedBy(UUID createdBy);
    List<OfertaFinanciamiento> findByCreatedByAndCountryCode(UUID createdBy, String countryCode);
    List<OfertaFinanciamiento> findByDealId(String dealId);
    List<OfertaFinanciamiento> findByCountryCode(String countryCode);
}

