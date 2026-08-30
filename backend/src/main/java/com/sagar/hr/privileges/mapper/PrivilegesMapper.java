package com.sagar.hr.privileges.mapper;

import com.sagar.hr.privileges.dto.request.CreatePrivilegesRequest;
import com.sagar.hr.privileges.dto.request.UpdatePrivilegesRequest;
import com.sagar.hr.privileges.dto.response.PrivilegesResponse;
import com.sagar.hr.privileges.entity.Privileges;
import com.sagar.hr.util.enums.Status;
import org.springframework.stereotype.Component;

@Component
public class PrivilegesMapper {

    public Privileges toEntity(CreatePrivilegesRequest request) {
        return Privileges.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .build();
    }

    public Privileges toEntity(UpdatePrivilegesRequest request) {
        return Privileges.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .build();
    }

    public PrivilegesResponse toResponse(Privileges entity) {
        return PrivilegesResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .status(entity.getStatus())
                .build();
    }
}
