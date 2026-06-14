package com.sagar.hr.security.services;

import com.sagar.hr.security.model.User;
import com.sagar.hr.security.model.Permission;
import com.sagar.hr.permission.repository.PermissionRepository;
import com.sagar.hr.security.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    public UserDetailsServiceImpl(UserRepository userRepository, PermissionRepository permissionRepository) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        boolean isSuperAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_SUPER_ADMIN"));

        Collection<String> allPermissions = Collections.emptyList();
        if (isSuperAdmin) {
            allPermissions = permissionRepository.findAll().stream()
                    .map(Permission::getName)
                    .collect(Collectors.toList());
        }

        return UserDetailsImpl.build(user, allPermissions);
    }
}
