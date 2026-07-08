package com.sagar.hr.usermanagement.mapper;

import com.sagar.hr.security.model.Role;
import com.sagar.hr.security.model.User;
import com.sagar.hr.usermanagement.dto.response.UserResponse;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }
}
