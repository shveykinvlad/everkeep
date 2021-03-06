package com.everkeep.service;

import java.time.OffsetDateTime;
import java.util.UUID;
import javax.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.everkeep.exception.VerificationTokenExpirationException;
import com.everkeep.model.User;
import com.everkeep.model.VerificationToken;
import com.everkeep.repository.VerificationTokenRepository;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTokenRepository verificationTokenRepository;

    @Value("${verificationToken.expirationTimeSec}")
    private long expirationTimeSec;

    public VerificationToken create(User user, VerificationToken.Action tokenAction) {
        var tokenValue = UUID.randomUUID().toString();
        var tokenExpiryTime = OffsetDateTime.now().plusSeconds(expirationTimeSec);
        var verificationToken = new VerificationToken()
                .setValue(tokenValue)
                .setUser(user)
                .setExpiryTime(tokenExpiryTime)
                .setAction(tokenAction);

        return verificationTokenRepository.save(verificationToken);
    }

    public VerificationToken get(String value, VerificationToken.Action action) {
        return verificationTokenRepository.findByValueAndAction(value, action)
                .orElseThrow(() -> new EntityNotFoundException("VerificationToken " + value + " for action " + action + " not found"));
    }

    public VerificationToken validateAndUtilize(String value, VerificationToken.Action active) {
        var verificationToken = get(value, active);
        validateToken(verificationToken);

        return utilize(verificationToken);
    }

    private void validateToken(VerificationToken verificationToken) {
        if ((OffsetDateTime.now().isAfter(verificationToken.getExpiryTime()))) {
            throw new VerificationTokenExpirationException("Verification token is expired", verificationToken.getValue());
        }
    }

    private VerificationToken utilize(VerificationToken verificationToken) {
        verificationToken.setActive(false);
        return verificationTokenRepository.save(verificationToken);
    }
}
