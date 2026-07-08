package com.sagar.hr.endpointrole.mapper;

import com.sagar.hr.endpointrole.dto.response.EndpointRoleResponse;
import com.sagar.hr.security.model.EndpointRole;
import org.springframework.stereotype.Component;

@Component
public class EndpointRoleMapper {

    public EndpointRoleResponse toResponse(EndpointRole entity) {
        return EndpointRoleResponse.builder()
                .id(entity.getId())
                .urlPattern(entity.getUrlPattern())
                .httpMethod(entity.getHttpMethod())
                .roleName(entity.getRole().getName())
                .build();
    }
}
