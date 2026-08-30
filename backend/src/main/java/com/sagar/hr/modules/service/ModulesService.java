package com.sagar.hr.modules.service;

import com.sagar.hr.modules.dto.request.CreateModulesRequest;
import com.sagar.hr.modules.dto.request.UpdateModulesRequest;
import com.sagar.hr.modules.dto.response.ModulesResponse;

import java.util.List;

public interface ModulesService {

    List<ModulesResponse> findAll();

    ModulesResponse findById(Long id);

    ModulesResponse create(CreateModulesRequest request);

    ModulesResponse update(Long id, UpdateModulesRequest request);

    void deleteById(Long id);
}
