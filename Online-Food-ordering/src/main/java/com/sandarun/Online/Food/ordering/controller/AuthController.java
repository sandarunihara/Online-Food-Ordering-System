package com.sandarun.Online.Food.ordering.controller;

import com.sandarun.Online.Food.ordering.config.JwtProvider;
import com.sandarun.Online.Food.ordering.model.Cart;
import com.sandarun.Online.Food.ordering.model.USER_ROLE;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.repository.CartRepository;
import com.sandarun.Online.Food.ordering.repository.UserRepository;
import com.sandarun.Online.Food.ordering.request.LoginRequest;
import com.sandarun.Online.Food.ordering.response.AuthResponse;
import com.sandarun.Online.Food.ordering.service.CustomerUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws  Exception{

        User isEmailExist = userRepository.findByEmail(user.getEmail());
        if(isEmailExist != null){
            throw new Exception("Email already exists");
        }

        User createuser=new User();
        createuser.setEmail(user.getEmail());
        createuser.setFullName(user.getFullName());
        createuser.setRole(user.getRole());
        createuser.setPassword(passwordEncoder.encode(user.getPassword()));

        User saveduser=userRepository.save(createuser);

        Cart cart=new Cart();
        cart.setCustomer(saveduser);
        cartRepository.save(cart);

        Authentication authentication=new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt=jwtProvider.genarateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Registered Successfully");
        authResponse.setRole(saveduser.getRole());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public  ResponseEntity<AuthResponse> sighin(@RequestBody LoginRequest req){

        String username=req.getEmail();
        String password=req.getPassword();

        Authentication authentication =authenticate(username,password);

        Collection<? extends GrantedAuthority> authorities=authentication.getAuthorities();
        String role=authorities.isEmpty()?null:authorities.iterator().next().getAuthority();

        String jwt=jwtProvider.genarateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setRole(USER_ROLE.valueOf(role));

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);

    }

    private Authentication authenticate(String username, String password) {

        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username or password");
        }
        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    }
}
 