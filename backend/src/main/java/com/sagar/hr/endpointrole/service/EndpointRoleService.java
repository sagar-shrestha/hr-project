package com.sagar.hr.endpointrole.service;

import com.sagar.hr.endpointrole.dto.request.CreateEndpointRoleRequest;
import com.sagar.hr.endpointrole.dto.request.UpdateEndpointRoleRequest;
import com.sagar.hr.endpointrole.dto.response.EndpointRoleResponse;
import com.sagar.hr.endpointrole.mapper.EndpointRoleMapper;
import com.sagar.hr.endpointrole.repository.EndpointRoleRepository;
import com.sagar.hr.security.model.EndpointRole;
import com.sagar.hr.security.model.Role;
import com.sagar.hr.security.repository.RoleRepository;
import com.sagar.hr.util.exception.AlreadyInUseException;
import com.sagar.hr.util.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EndpointRoleService {

    private final EndpointRoleRepository endpointRoleRepository;
    private final RoleRepository roleRepository;
    private final EndpointRoleMapper mapper;

    public List<EndpointRoleResponse> findAll() {
        return endpointRoleRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public EndpointRoleResponse findById(Long id) {
        EndpointRole entity = endpointRoleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Endpoint role not found with id: " + id));
        return mapper.toResponse(entity);
    }

    @Transactional
    public EndpointRoleResponse create(CreateEndpointRoleRequest request) {
        if (endpointRoleRepository.findByUrlPatternAndHttpMethod(request.getUrlPattern(), request.getHttpMethod()).isPresent()) {
            throw new AlreadyInUseException("Endpoint role already exists for " + request.getHttpMethod() + " " + request.getUrlPattern());
        }

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new NotFoundException("Role not found: " + request.getRoleName()));

        EndpointRole entity = EndpointRole.builder()
                .urlPattern(request.getUrlPattern())
                .httpMethod(request.getHttpMethod().toUpperCase())
                .role(role)
                .build();

        return mapper.toResponse(endpointRoleRepository.save(entity));
    }

    @Transactional
    public EndpointRoleResponse update(Long id, UpdateEndpointRoleRequest request) {
        EndpointRole entity = endpointRoleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Endpoint role not found with id: " + id));

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new NotFoundException("Role not found: " + request.getRoleName()));

        entity.setUrlPattern(request.getUrlPattern());
        entity.setHttpMethod(request.getHttpMethod().toUpperCase());
        entity.setRole(role);

        return mapper.toResponse(endpointRoleRepository.save(entity));
    }

    @Transactional
    public void deleteById(Long id) {
        if (!endpointRoleRepository.existsById(id)) {
            throw new NotFoundException("Endpoint role not found with id: " + id);
        }
        endpointRoleRepository.deleteById(id);
    }
}
