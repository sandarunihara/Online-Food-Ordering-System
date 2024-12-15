package com.sandarun.Online.Food.ordering.repository;

import com.sandarun.Online.Food.ordering.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User,Long> {
    public  User findByEmail(String email);
}
