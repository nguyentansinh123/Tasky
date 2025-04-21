package com.example.server.service.token;

import com.example.server.model.Token;
import com.example.server.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    public Optional<Token> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public Token save(Token token) {
        return tokenRepository.save(token);
    }
}
