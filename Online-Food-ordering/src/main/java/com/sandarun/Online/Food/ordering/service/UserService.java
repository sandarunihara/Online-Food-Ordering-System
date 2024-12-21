package com.sandarun.Online.Food.ordering.service;

import com.sandarun.Online.Food.ordering.model.User;

public interface UserService {

    public User findUserByJwtToken(String jwt) throws Exception;

    public  User findUserByEmail(String email) throws Exception;
}
