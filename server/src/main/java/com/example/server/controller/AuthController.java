package com.example.server.controller;

import com.example.server.enums.Roles;
import com.example.server.model.Role;
import com.example.server.model.Token;
import com.example.server.model.User;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.UserRepository;
import com.example.server.request.LoginRequest;
import com.example.server.request.RegisterRequest;
import com.example.server.response.ApiResponse;
import com.example.server.response.JwtResponse;
import com.example.server.security.jwt.JwtUtils;
import com.example.server.security.user.ShopUserDetails;
import com.example.server.service.Email.EmailService;
import com.example.server.service.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;
    private final EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login( @Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateTokenForUser( authentication );
            ShopUserDetails userDetails = (ShopUserDetails) authentication.getPrincipal();
            JwtResponse jwtResponse = new JwtResponse(userDetails.getId(), jwt);

            return ResponseEntity.ok(new ApiResponse("Login Successful", true,jwtResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("Invalid username or password", false, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse("Email is already in use", false, null));
            }

            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            Role userRole = roleRepository.findByName(Roles.USER)
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.getRoles().add(userRole);

            userRepository.save(user);

            Token confirmationToken = new Token(
                    UUID.randomUUID().toString(),
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(15),
                    user
            );

            tokenService.save(confirmationToken);

            emailService.send(user.getEmail(), confirmationToken.getToken());

            return ResponseEntity.ok(new ApiResponse("Registration successful", true, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An error occurred during registration", false, e.getMessage()));
        }
    }

    public void confirmToken(String token){
        Token confirmToken = tokenService.findByToken(token)
                .orElseThrow(() -> new UsernameNotFoundException("Token Not Found"));

        if(confirmToken.getConfirmedAt() != null){
            throw new IllegalArgumentException("Token Already Confirmed");
        }

        LocalDateTime expiresAt = confirmToken.getExpiresAt();
        if(expiresAt.isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Token Expired");
        }


        confirmToken.setConfirmedAt(LocalDateTime.now());
        tokenService.save(confirmToken);

        enableUser(confirmToken.getUser());
    }
    private void enableUser(User user) {
        user.setEnabled(true);
        userRepository.save(user);
    }

    @GetMapping("/register/confirmToken")
    public ResponseEntity<ApiResponse> confirmingToken(@RequestParam String token) {
        try {
            confirmToken(token);
            return ResponseEntity.ok(new ApiResponse("Token confirmed successfully. Your account is now enabled.", true, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("An unexpected error occurred while confirming the token.", false, e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse> checkAuthentication(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            // Handle the case where principal is a String (username)
            String email;
            if (authentication.getPrincipal() instanceof String) {
                email = (String) authentication.getPrincipal();
            } else {
                ShopUserDetails userDetails = (ShopUserDetails) authentication.getPrincipal();
                email = userDetails.getUsername();
            }

            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("User not found", false, null));
            }

            return ResponseEntity.ok(new ApiResponse("User is authenticated", true, user));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse("User is not authenticated", false, null));
    }
}
