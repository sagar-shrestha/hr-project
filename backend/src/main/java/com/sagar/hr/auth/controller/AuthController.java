package com.sagar.hr.auth.controller;

import com.sagar.hr.security.dto.request.LoginRequest;
import com.sagar.hr.security.dto.request.SignupRequest;
import com.sagar.hr.security.dto.response.JwtResponse;
import com.sagar.hr.auth.service.AuthService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping(value = "/signin")
    public ResponseEntity<GlobalApiResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ControllerUtil.ok("Authentication successful", jwtResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<GlobalApiResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        return ControllerUtil.created("User registered successfully", null);
    }
}
