package com.sagar.hr.screens.mapper;

import com.sagar.hr.modules.dto.response.ModulesResponse;
import com.sagar.hr.modules.entity.Modules;
import com.sagar.hr.modules.mapper.ModulesMapper;
import com.sagar.hr.screens.dto.request.CreateScreensRequest;
import com.sagar.hr.screens.dto.request.ModuleRequest;
import com.sagar.hr.screens.dto.request.UpdateScreensRequest;
import com.sagar.hr.screens.dto.response.ScreensResponse;
import com.sagar.hr.screens.entity.Screens;
import com.sagar.hr.util.enums.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ScreensMapper {

    private final ModulesMapper modulesMapper;

    public Screens toEntity(CreateScreensRequest request) {
        return Screens.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .modules(buildModules(request.getModules()))
                .build();
    }

    public Screens toEntity(UpdateScreensRequest request) {
        return Screens.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .modules(buildModules(request.getModules()))
                .build();
    }

    public ScreensResponse toResponse(Screens entity) {
        return ScreensResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .status(entity.getStatus())
                .modules(entity.getModules().stream()
                        .map(modulesMapper::toResponse)
                        .toList())
                .build();
    }

    private List<Modules> buildModules(List<ModuleRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }
        return requests.stream()
                .map(r -> Modules.builder()
                        .name(r.getName())
                        .code(r.getCode())
                        .status(r.getStatus() != null ? r.getStatus() : Status.ACTIVE)
                        .build())
                .toList();
    }
}
