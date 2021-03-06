package com.everkeep.config.security;

import static java.nio.charset.StandardCharsets.UTF_16;

import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.everkeep.model.User;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    public Claims getClaimsFromToken(String authToken) {
        var key = Base64.getEncoder().encodeToString(jwtProperties.getSecret().getBytes(UTF_16));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(authToken)
                .getBody();
    }

    public String generateToken(User user) {
        var claims = Map.of("roles", user.getRolesNames());
        var expirationSeconds = Long.parseLong(jwtProperties.getExpirationTimeSec());
        var creationDate = Date.from(OffsetDateTime.now().toInstant());
        var expirationDate = Date.from(OffsetDateTime.now().plusSeconds(expirationSeconds).toInstant());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(creationDate)
                .setExpiration(expirationDate)
                .signWith(Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(UTF_16)))
                .compact();
    }
}
