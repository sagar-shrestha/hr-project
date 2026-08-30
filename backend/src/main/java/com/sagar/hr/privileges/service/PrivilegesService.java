package com.sagar.hr.privileges.service;

import com.sagar.hr.privileges.dto.request.CreatePrivilegesRequest;
import com.sagar.hr.privileges.dto.request.UpdatePrivilegesRequest;
import com.sagar.hr.privileges.dto.response.PrivilegesResponse;

import java.util.List;

public interface PrivilegesService {

    List<PrivilegesResponse> findAll();

    PrivilegesResponse findById(Long id);

    PrivilegesResponse create(CreatePrivilegesRequest request);

    PrivilegesResponse update(Long id, UpdatePrivilegesRequest request);

    void deleteById(Long id);
}
