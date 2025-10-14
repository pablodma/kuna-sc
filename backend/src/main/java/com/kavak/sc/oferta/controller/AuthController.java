package com.kavak.sc.oferta.controller;

import com.kavak.sc.oferta.dto.AuthRequest;
import com.kavak.sc.oferta.dto.AuthResponse;
import com.kavak.sc.oferta.entity.User;
import com.kavak.sc.oferta.security.JwtUtil;
import com.kavak.sc.oferta.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        User user = userService.createUser(request.getUsername(), request.getPassword(), User.Role.USER);
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
}

