package com.example.demo.security.services;

import com.example.demo.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;

    @Getter
    private Long id;

    private String username;

    @Getter
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    @Getter
    private Set<String> roles;

    public static UserDetailsImpl build(User user, Collection<String> allPermissions) {
        // Extract actual user roles (not inherited from hierarchy)
        Set<String> userRoles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
        boolean isSuperAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_SUPER_ADMIN"));

        // Collect Roles
        List<GrantedAuthority> roleAuthorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        List<GrantedAuthority> authorities;
        if (isSuperAdmin && allPermissions != null) {
            // For Super Admin, grant all system permissions explicitly
            List<GrantedAuthority> permissionAuthorities = allPermissions.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            authorities = Stream.concat(roleAuthorities.stream(), permissionAuthorities.stream())
                    .collect(Collectors.toList());
        } else {
            // Collect Permissions from all Roles for normal users
            List<GrantedAuthority> permissionAuthorities = user.getRoles().stream()
                    .flatMap(role -> role.getPermissions().stream())
                    .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                    .collect(Collectors.toList());

            // Combine both
            authorities = Stream.concat(roleAuthorities.stream(), permissionAuthorities.stream())
                    .collect(Collectors.toList());
        }

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                userRoles);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
