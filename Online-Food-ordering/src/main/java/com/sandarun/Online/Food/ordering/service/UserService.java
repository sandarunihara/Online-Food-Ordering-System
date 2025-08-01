package com.sandarun.Online.Food.ordering.service;

import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.request.UpdateUserRequest;

public interface UserService {

    public User findUserByJwtToken(String jwt) throws Exception;

    public User findUserByEmail(String email) throws Exception;
    
    public User updateUser(Long userId, UpdateUserRequest request) throws Exception;




}
