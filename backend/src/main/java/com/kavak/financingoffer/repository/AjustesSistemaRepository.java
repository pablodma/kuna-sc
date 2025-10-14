package com.kavak.financingoffer.repository;

import com.kavak.financingoffer.entity.AjustesSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AjustesSistemaRepository extends JpaRepository<AjustesSistema, Integer> {
    AjustesSistema findTopByOrderByUpdatedAtDesc();
}

