package com.sandarun.Online.Food.ordering.service;

import com.sandarun.Online.Food.ordering.config.JwtProvider;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements  UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email=jwtProvider.getEmailFromJwtToken(jwt);
        User user=findUserByEmail(email);
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user=userRepository.findByEmail(email);

        if(user==null){
            throw new Exception("User not found");
        }
        return user;
    }

}
