package com.sagar.hr.util.audit;

import com.sagar.hr.security.services.UserDetailsImpl;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.of("SYSTEM");
        }
        if (authentication.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return Optional.ofNullable(userDetails.getUsername());
        }
        return Optional.of("SYSTEM");
    }
}
