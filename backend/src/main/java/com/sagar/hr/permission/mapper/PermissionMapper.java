package com.sagar.hr.permission.mapper;

import com.sagar.hr.permission.dto.response.PermissionResponse;
import com.sagar.hr.security.model.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper {

    public PermissionResponse toResponse(Permission entity) {
        return PermissionResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .build();
    }
}
