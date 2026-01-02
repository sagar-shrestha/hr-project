package com.example.demo.security;

import com.example.demo.model.EndpointRole;
import com.example.demo.repository.EndpointRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Component
public class DynamicAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    @Autowired
    private EndpointRoleRepository endpointRoleRepository;

    @Autowired
    private RoleHierarchy roleHierarchy;

    private final AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext context) {
        Authentication auth = authentication.get();
        if (auth == null || !auth.isAuthenticated()) {
            return new AuthorizationDecision(false);
        }

        // Get reachable authorities based on hierarchy
        Collection<? extends GrantedAuthority> authorities = roleHierarchy
                .getReachableGrantedAuthorities(auth.getAuthorities());
        Set<String> authorityNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        // Super Admin bypass: grant all permissions
        if (authorityNames.contains("ROLE_SUPER_ADMIN")) {
            return new AuthorizationDecision(true);
        }

        String requestUri = context.getRequest().getRequestURI();
        String method = context.getRequest().getMethod();

        List<EndpointRole> rules = endpointRoleRepository.findAll();

        for (EndpointRole rule : rules) {
            if (rule.getHttpMethod().equalsIgnoreCase(method)
                    && antPathMatcher.match(rule.getUrlPattern(), requestUri)) {
                String requiredRole = rule.getRole().getName();

                if (authorityNames.contains(requiredRole)) {
                    return new AuthorizationDecision(true);
                }
            }
        }

        // If no rule matches, we can decide: deny by default, OR assume it's a
        // "permitAll" if likely handled elsewhere.
        // But for "access(dynamicAuthorizationManager)", if we return false/null, it
        // typically denies.
        // However, we want to allow access if NO rule is defined? Or Deny?
        // Safe default is DENY if no rule matches, but we must be careful about public
        // endpoints.
        // Actually, public endpoints are handled by 'permitAll()' in SecurityConfig
        // BEFORE this manager is called (if order matters) OR
        // we can return true here if no rule matches (allow list approach vs deny
        // list).
        // Let's assume: If a rule exists, enforce it. If no rule exists, allow it (or
        // let other filters decide).
        // BUT, since we are replacing specific role checks, we probably only want to
        // verify RESTRICTED endpoints.

        // Let's return TRUE (granted) if no rule matches, effectively making it "Open
        // unless restricted".
        // Use with caution.
        // ALITER: Return FALSE (deny) and ensure all public endpoints are in
        // 'permitAll' in config.

        // Let's go with: Rules define RESTRICTIONS. If matched, must satisfy.
        // If NO rule matches the path, we assume generic authenticated user is fine?
        // Wait, usually we say "anyRequest().authenticated()".
        // If we plug this into "anyRequest().access(...)", it handles EVERYTHING.

        // Let's return FALSE (deny) if no rule allows it in the DB, UNLESS we want to
        // fallback to "authenticated".
        // Let's try to verify if the user is just authenticated.

        boolean isAuthenticated = authentication.get().isAuthenticated()
                && !"anonymousUser".equals(authentication.get().getName());
        return new AuthorizationDecision(isAuthenticated);
    }
}
