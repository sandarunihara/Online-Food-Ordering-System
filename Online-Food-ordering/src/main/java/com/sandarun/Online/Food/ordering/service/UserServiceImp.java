package com.sandarun.Online.Food.ordering.service;

import com.sandarun.Online.Food.ordering.config.JwtProvider;
import com.sandarun.Online.Food.ordering.model.Address;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.repository.AddressRepository;
import com.sandarun.Online.Food.ordering.repository.UserRepository;
import com.sandarun.Online.Food.ordering.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements  UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

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

    @Override
    public User updateUser(Long userId, UpdateUserRequest request) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
//        System.out.println("\n"+request+"\n");
        // Note: Add more fields as needed based on User model
        if(request.getStreet()!=null){
            Address address=new Address();
            address.setStreet(request.getStreet());
            address.setCity(request.getCity());
            address.setState(request.getState());
            address.setCountry(request.getCountry());
            address.setPostalCode(request.getPostalCode());

            user.getAddresses().add(address);
            addressRepository.save(address);
        }

        
        return userRepository.save(user);
    }

}
