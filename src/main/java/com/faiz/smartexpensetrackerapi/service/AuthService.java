package com.faiz.smartexpensetrackerapi.service;

import com.faiz.smartexpensetrackerapi.dto.auth.AuthResponse;
import com.faiz.smartexpensetrackerapi.dto.auth.LoginRequest;
import com.faiz.smartexpensetrackerapi.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}