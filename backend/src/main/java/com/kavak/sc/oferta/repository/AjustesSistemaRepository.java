package com.kavak.sc.oferta.repository;

import com.kavak.sc.oferta.entity.AjustesSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AjustesSistemaRepository extends JpaRepository<AjustesSistema, Integer> {
    AjustesSistema findTopByOrderByUpdatedAtDesc();
    Optional<AjustesSistema> findByCountryCode(String countryCode);
    AjustesSistema findTopByCountryCodeOrderByUpdatedAtDesc(String countryCode);
}

