package com.faiz.smartexpensetrackerapi.controller;

import com.faiz.smartexpensetrackerapi.dto.auth.AuthResponse;
import com.faiz.smartexpensetrackerapi.dto.auth.ForgotPasswordRequest;
import com.faiz.smartexpensetrackerapi.dto.auth.LoginRequest;
import com.faiz.smartexpensetrackerapi.dto.auth.RegisterRequest;
import com.faiz.smartexpensetrackerapi.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }
}
