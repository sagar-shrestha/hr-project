package com.sagar.hr.screens.service;

import com.sagar.hr.modules.repository.ModulesRepository;
import com.sagar.hr.screens.dto.request.CreateScreensRequest;
import com.sagar.hr.screens.dto.request.ModuleRequest;
import com.sagar.hr.screens.dto.request.UpdateScreensRequest;
import com.sagar.hr.screens.dto.response.ScreensResponse;
import com.sagar.hr.screens.entity.Screens;
import com.sagar.hr.screens.exception.ScreensNotFoundException;
import com.sagar.hr.screens.mapper.ScreensMapper;
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
public class ScreensServiceImpl implements ScreensService {

    private final ScreensRepository screensRepository;
    private final ScreensMapper screensMapper;
    private final ModulesRepository modulesRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ScreensResponse> findAll() {
        return screensRepository.findAll().stream()
                .map(screensMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ScreensResponse findById(Long id) {
        return screensMapper.toResponse(getEntity(id));
    }

    @Override
    @Transactional
    public ScreensResponse create(CreateScreensRequest request) {
        validateUnique(request.getName(), request.getCode(), null);
        validateModules(request.getModules());
        Screens saved = screensRepository.save(screensMapper.toEntity(request));
        log.info("Screens created with id: {}", saved.getId());
        return screensMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ScreensResponse update(Long id, UpdateScreensRequest request) {
        Screens screens = getEntity(id);
        validateUnique(request.getName(), request.getCode(), id);
        if (request.getModules() != null) {
            validateModules(request.getModules());
            screens.getModules().clear();
            screens.getModules().addAll(screensMapper.toEntity(request).getModules());
        }
        screens.setName(request.getName());
        screens.setCode(request.getCode());
        screens.setStatus(request.getStatus());
        log.info("Screens updated with id: {}", id);
        return screensMapper.toResponse(screensRepository.save(screens));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        getEntity(id);
        screensRepository.deleteScreensById(id);
        log.info("Screens soft-deleted with id: {}", id);
    }

    private Screens getEntity(Long id) {
        return screensRepository.findById(id)
                .orElseThrow(() -> new ScreensNotFoundException("Screen not found with id: " + id));
    }

    private void validateUnique(String name, String code, Long currentId) {
        screensRepository.findByName(name)
                .filter(s -> !s.getId().equals(currentId))
                .ifPresent(s -> {
                    throw new AlreadyInUseException("Screen name is already taken: " + name);
                });
        screensRepository.findByCode(code)
                .filter(s -> !s.getId().equals(currentId))
                .ifPresent(s -> {
                    throw new AlreadyInUseException("Screen code is already taken: " + code);
                });
    }

    private void validateModules(List<ModuleRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return;
        }
        Set<String> names = new HashSet<>();
        Set<String> codes = new HashSet<>();
        for (ModuleRequest r : requests) {
            if (!names.add(r.getName())) {
                throw new AlreadyInUseException("Duplicate module name in request: " + r.getName());
            }
            if (!codes.add(r.getCode())) {
                throw new AlreadyInUseException("Duplicate module code in request: " + r.getCode());
            }
            modulesRepository.findByName(r.getName()).ifPresent(m -> {
                throw new AlreadyInUseException("Module name is already taken: " + r.getName());
            });
            modulesRepository.findByCode(r.getCode()).ifPresent(m -> {
                throw new AlreadyInUseException("Module code is already taken: " + r.getCode());
            });
        }
    }
}
