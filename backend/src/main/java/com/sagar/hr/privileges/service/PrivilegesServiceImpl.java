package com.sagar.hr.privileges.service;

import com.sagar.hr.privileges.dto.request.CreatePrivilegesRequest;
import com.sagar.hr.privileges.dto.request.UpdatePrivilegesRequest;
import com.sagar.hr.privileges.dto.response.PrivilegesResponse;
import com.sagar.hr.privileges.entity.Privileges;
import com.sagar.hr.privileges.exception.PrivilegesNotFoundException;
import com.sagar.hr.privileges.mapper.PrivilegesMapper;
import com.sagar.hr.privileges.repository.PrivilegesRepository;
import com.sagar.hr.util.exception.AlreadyInUseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrivilegesServiceImpl implements PrivilegesService {

    private final PrivilegesRepository privilegesRepository;
    private final PrivilegesMapper privilegesMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PrivilegesResponse> findAll() {
        return privilegesRepository.findAll().stream()
                .map(privilegesMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PrivilegesResponse findById(Long id) {
        return privilegesMapper.toResponse(getEntity(id));
    }

    @Override
    @Transactional
    public PrivilegesResponse create(CreatePrivilegesRequest request) {
        validateUnique(request.getName(), request.getCode(), null);
        Privileges saved = privilegesRepository.save(privilegesMapper.toEntity(request));
        log.info("Privileges created with id: {}", saved.getId());
        return privilegesMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PrivilegesResponse update(Long id, UpdatePrivilegesRequest request) {
        Privileges privileges = getEntity(id);
        validateUnique(request.getName(), request.getCode(), id);
        privileges.setName(request.getName());
        privileges.setCode(request.getCode());
        privileges.setStatus(request.getStatus());
        log.info("Privileges updated with id: {}", id);
        return privilegesMapper.toResponse(privilegesRepository.save(privileges));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        getEntity(id);
        privilegesRepository.deletePrivilegesById(id);
        log.info("Privileges soft-deleted with id: {}", id);
    }

    private Privileges getEntity(Long id) {
        return privilegesRepository.findById(id)
                .orElseThrow(() -> new PrivilegesNotFoundException("Privilege not found with id: " + id));
    }

    private void validateUnique(String name, String code, Long currentId) {
        privilegesRepository.findByName(name)
                .filter(p -> !p.getId().equals(currentId))
                .ifPresent(p -> {
                    throw new AlreadyInUseException("Privilege name is already taken: " + name);
                });
        privilegesRepository.findByCode(code)
                .filter(p -> !p.getId().equals(currentId))
                .ifPresent(p -> {
                    throw new AlreadyInUseException("Privilege code is already taken: " + code);
                });
    }
}
