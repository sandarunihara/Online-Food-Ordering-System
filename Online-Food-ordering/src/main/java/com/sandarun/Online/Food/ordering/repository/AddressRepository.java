package com.sandarun.Online.Food.ordering.repository;

import com.sandarun.Online.Food.ordering.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
