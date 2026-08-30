package com.sagar.hr.endpoint.mapper;

import com.sagar.hr.endpoint.dto.request.CreateEndpointRequest;
import com.sagar.hr.endpoint.dto.request.UpdateEndpointRequest;
import com.sagar.hr.endpoint.dto.response.EndpointModulePrivilegeResponse;
import com.sagar.hr.endpoint.dto.response.EndpointResponse;
import com.sagar.hr.endpoint.entity.Endpoint;
import com.sagar.hr.util.enums.Status;
import org.springframework.stereotype.Component;

@Component
public class EndpointMapper {

    public Endpoint toEntity(CreateEndpointRequest request) {
        return Endpoint.builder()
                .name(request.getName())
                .code(request.getCode())
                .urlPattern(request.getUrlPattern())
                .httpMethod(request.getHttpMethod().toUpperCase())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .build();
    }

    public Endpoint toEntity(UpdateEndpointRequest request) {
        return Endpoint.builder()
                .name(request.getName())
                .code(request.getCode())
                .urlPattern(request.getUrlPattern())
                .httpMethod(request.getHttpMethod().toUpperCase())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .build();
    }

    public EndpointResponse toResponse(Endpoint entity) {
        return EndpointResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .urlPattern(entity.getUrlPattern())
                .httpMethod(entity.getHttpMethod())
                .status(entity.getStatus())
                .modulePrivileges(entity.getMappings().stream()
                        .map(m -> EndpointModulePrivilegeResponse.builder()
                                .moduleId(m.getModules().getId())
                                .moduleName(m.getModules().getName())
                                .moduleCode(m.getModules().getCode())
                                .privilegeId(m.getPrivileges().getId())
                                .privilegeName(m.getPrivileges().getName())
                                .privilegeCode(m.getPrivileges().getCode())
                                .build())
                        .toList())
                .build();
    }
}