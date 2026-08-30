package com.sagar.hr.endpoint.service;

import com.sagar.hr.endpoint.dto.request.CreateEndpointRequest;
import com.sagar.hr.endpoint.dto.request.ModulePrivilegeRequest;
import com.sagar.hr.endpoint.dto.request.UpdateEndpointRequest;
import com.sagar.hr.endpoint.dto.response.EndpointResponse;
import com.sagar.hr.endpoint.entity.Endpoint;
import com.sagar.hr.endpoint.entity.ModulesPrivilegesMappingEndpoints;
import com.sagar.hr.endpoint.exception.EndpointNotFoundException;
import com.sagar.hr.endpoint.mapper.EndpointMapper;
import com.sagar.hr.endpoint.repository.EndpointRepository;
import com.sagar.hr.endpoint.repository.ModulesPrivilegesMappingEndpointsRepository;
import com.sagar.hr.modules.entity.Modules;
import com.sagar.hr.modules.exception.ModulesNotFoundException;
import com.sagar.hr.modules.repository.ModulesRepository;
import com.sagar.hr.privileges.entity.Privileges;
import com.sagar.hr.privileges.exception.PrivilegesNotFoundException;
import com.sagar.hr.privileges.repository.PrivilegesRepository;
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
public class EndpointServiceImpl implements EndpointService {

    private final EndpointRepository endpointRepository;
    private final EndpointMapper endpointMapper;
    private final ModulesRepository modulesRepository;
    private final PrivilegesRepository privilegesRepository;
    private final ModulesPrivilegesMappingEndpointsRepository mappingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EndpointResponse> findAll() {
        return endpointRepository.findAll().stream()
                .map(endpointMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EndpointResponse findById(Long id) {
        return endpointMapper.toResponse(getEntity(id));
    }

    @Override
    @Transactional
    public EndpointResponse create(CreateEndpointRequest request) {
        validateUnique(request.getName(), request.getCode(), request.getUrlPattern(), null);
        Endpoint saved = endpointRepository.save(endpointMapper.toEntity(request));
        attachMappings(saved, request.getModulePrivileges());
        log.info("Endpoint created with id: {}", saved.getId());
        return endpointMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public EndpointResponse update(Long id, UpdateEndpointRequest request) {
        Endpoint endpoint = getEntity(id);
        validateUnique(request.getName(), request.getCode(), request.getUrlPattern(), id);
        endpoint.setName(request.getName());
        endpoint.setCode(request.getCode());
        endpoint.setUrlPattern(request.getUrlPattern());
        endpoint.setHttpMethod(request.getHttpMethod().toUpperCase());
        endpoint.setStatus(request.getStatus());
        log.info("Endpoint updated with id: {}", id);
        return endpointMapper.toResponse(endpointRepository.save(endpoint));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        getEntity(id);
        endpointRepository.deleteEndpointById(id);
        log.info("Endpoint soft-deleted with id: {}", id);
    }

    private Endpoint getEntity(Long id) {
        return endpointRepository.findById(id)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint not found with id: " + id));
    }

    private void validateUnique(String name, String code, String urlPattern, Long currentId) {
        endpointRepository.findByName(name)
                .filter(e -> !e.getId().equals(currentId))
                .ifPresent(e -> { throw new AlreadyInUseException("Endpoint name is already taken: " + name); });
        endpointRepository.findByCode(code)
                .filter(e -> !e.getId().equals(currentId))
                .ifPresent(e -> { throw new AlreadyInUseException("Endpoint code is already taken: " + code); });
        endpointRepository.findByUrlPattern(urlPattern)
                .filter(e -> !e.getId().equals(currentId))
                .ifPresent(e -> { throw new AlreadyInUseException("Endpoint urlPattern is already taken: " + urlPattern); });
    }

    private void attachMappings(Endpoint endpoint, List<ModulePrivilegeRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return;
        }
        Set<String> seen = new HashSet<>();
        for (ModulePrivilegeRequest req : requests) {
            String key = req.getModuleId() + ":" + req.getPrivilegeId();
            if (!seen.add(key)) {
                throw new AlreadyInUseException("Duplicate module-privilege pair in request: " + key);
            }
            if (mappingRepository.existsByModulesIdAndPrivilegesIdAndEndpointId(
                    req.getModuleId(), req.getPrivilegeId(), endpoint.getId())) {
                throw new AlreadyInUseException("Mapping already exists for module " + req.getModuleId()
                        + " and privilege " + req.getPrivilegeId() + " on endpoint " + endpoint.getId());
            }
            Modules modules = modulesRepository.findById(req.getModuleId())
                    .orElseThrow(() -> new ModulesNotFoundException("Module not found with id: " + req.getModuleId()));
            Privileges privileges = privilegesRepository.findById(req.getPrivilegeId())
                    .orElseThrow(() -> new PrivilegesNotFoundException("Privilege not found with id: " + req.getPrivilegeId()));
            ModulesPrivilegesMappingEndpoints mapping = ModulesPrivilegesMappingEndpoints.builder()
                    .modules(modules)
                    .privileges(privileges)
                    .endpoint(endpoint)
                    .build();
            endpoint.getMappings().add(mapping);
        }
    }
}