package com.sagar.hr.security.auth_manager;

import com.sagar.hr.security.model.EndpointRole;
import com.sagar.hr.endpointrole.repository.EndpointRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.util.AntPathMatcher;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class DynamicAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private final EndpointRoleRepository endpointRoleRepository;
    private final RoleHierarchy roleHierarchy;

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
                // Rule matched but user lacks required role — deny immediately
                return new AuthorizationDecision(false);
            }
        }

        // No rule matched this endpoint — allow any authenticated user
        boolean isAuthenticated = authentication.get().isAuthenticated()
                && !"anonymousUser".equals(authentication.get().getName());
        return new AuthorizationDecision(isAuthenticated);
    }
}
