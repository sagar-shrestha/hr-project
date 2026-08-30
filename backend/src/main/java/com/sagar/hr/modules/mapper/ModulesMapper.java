package com.sagar.hr.modules.mapper;

import com.sagar.hr.modules.dto.request.CreateModulesRequest;
import com.sagar.hr.modules.dto.request.UpdateModulesRequest;
import com.sagar.hr.modules.dto.response.ModulesResponse;
import com.sagar.hr.modules.entity.Modules;
import com.sagar.hr.privileges.dto.response.PrivilegesResponse;
import com.sagar.hr.privileges.entity.Privileges;
import com.sagar.hr.privileges.mapper.PrivilegesMapper;
import com.sagar.hr.screens.entity.Screens;
import com.sagar.hr.util.enums.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ModulesMapper {

    private final PrivilegesMapper privilegesMapper;

    public Modules toEntity(CreateModulesRequest request, Screens screens, Set<Privileges> privileges) {
        return Modules.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .screens(screens)
                .privileges(privileges != null ? privileges : new HashSet<>())
                .build();
    }

    public Modules toEntity(UpdateModulesRequest request, Screens screens, Set<Privileges> privileges) {
        return Modules.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .screens(screens)
                .privileges(privileges != null ? privileges : new HashSet<>())
                .build();
    }

    public ModulesResponse toResponse(Modules entity) {
        return ModulesResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .status(entity.getStatus())
                .screensId(entity.getScreens() != null ? entity.getScreens().getId() : null)
                .privileges(entity.getPrivileges().stream()
                        .map(privilegesMapper::toResponse)
                        .toList())
                .build();
    }
}