package com.sagar.hr.modules.service;

import com.sagar.hr.modules.dto.request.CreateModulesRequest;
import com.sagar.hr.modules.dto.request.UpdateModulesRequest;
import com.sagar.hr.modules.dto.response.ModulesResponse;
import com.sagar.hr.modules.entity.Modules;
import com.sagar.hr.modules.exception.ModulesNotFoundException;
import com.sagar.hr.modules.mapper.ModulesMapper;
import com.sagar.hr.modules.repository.ModulesRepository;
import com.sagar.hr.privileges.entity.Privileges;
import com.sagar.hr.privileges.exception.PrivilegesNotFoundException;
import com.sagar.hr.privileges.repository.PrivilegesRepository;
import com.sagar.hr.screens.entity.Screens;
import com.sagar.hr.screens.exception.ScreensNotFoundException;
import com.sagar.hr.screens.repository.ScreensRepository;
import com.sagar.hr.util.exception.AlreadyInUseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ModulesServiceImpl implements ModulesService {

    private final ModulesRepository modulesRepository;
    private final ModulesMapper modulesMapper;
    private final ScreensRepository screensRepository;
    private final PrivilegesRepository privilegesRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ModulesResponse> findAll() {
        return modulesRepository.findAll().stream()
                .map(modulesMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ModulesResponse findById(Long id) {
        return modulesMapper.toResponse(getEntity(id));
    }

    @Override
    @Transactional
    public ModulesResponse create(CreateModulesRequest request) {
        validateUnique(request.getName(), request.getCode(), null);
        Screens screens = resolveScreens(request.getScreensId());
        Set<Privileges> privileges = resolvePrivileges(request.getPrivilegeIds());
        Modules saved = modulesRepository.save(modulesMapper.toEntity(request, screens, privileges));
        log.info("Modules created with id: {}", saved.getId());
        return modulesMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ModulesResponse update(Long id, UpdateModulesRequest request) {
        Modules modules = getEntity(id);
        validateUnique(request.getName(), request.getCode(), id);
        Screens screens = resolveScreens(request.getScreensId());
        modules.setName(request.getName());
        modules.setCode(request.getCode());
        modules.setStatus(request.getStatus());
        modules.setScreens(screens);
        if (request.getPrivilegeIds() != null) {
            modules.setPrivileges(resolvePrivileges(request.getPrivilegeIds()));
        }
        log.info("Modules updated with id: {}", id);
        return modulesMapper.toResponse(modulesRepository.save(modules));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        getEntity(id);
        modulesRepository.deleteModulesById(id);
        log.info("Modules soft-deleted with id: {}", id);
    }

    private Modules getEntity(Long id) {
        return modulesRepository.findById(id)
                .orElseThrow(() -> new ModulesNotFoundException("Module not found with id: " + id));
    }

    private Screens resolveScreens(Long screensId) {
        if (screensId == null) {
            return null;
        }
        return screensRepository.findById(screensId)
                .orElseThrow(() -> new ScreensNotFoundException("Screen not found with id: " + screensId));
    }

    private Set<Privileges> resolvePrivileges(List<Long> privilegeIds) {
        if (privilegeIds == null || privilegeIds.isEmpty()) {
            return new HashSet<>();
        }
        Set<Privileges> privileges = new HashSet<>();
        for (Long privilegeId : privilegeIds) {
            privileges.add(privilegesRepository.findById(privilegeId)
                    .orElseThrow(() -> new PrivilegesNotFoundException("Privilege not found with id: " + privilegeId)));
        }
        return privileges;
    }

    private void validateUnique(String name, String code, Long currentId) {
        modulesRepository.findByName(name)
                .filter(m -> !m.getId().equals(currentId))
                .ifPresent(m -> {
                    throw new AlreadyInUseException("Module name is already taken: " + name);
                });
        modulesRepository.findByCode(code)
                .filter(m -> !m.getId().equals(currentId))
                .ifPresent(m -> {
                    throw new AlreadyInUseException("Module code is already taken: " + code);
                });
    }
}