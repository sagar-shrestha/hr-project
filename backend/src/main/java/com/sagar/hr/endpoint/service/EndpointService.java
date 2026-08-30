package com.sagar.hr.endpoint.service;

import com.sagar.hr.endpoint.dto.request.CreateEndpointRequest;
import com.sagar.hr.endpoint.dto.request.UpdateEndpointRequest;
import com.sagar.hr.endpoint.dto.response.EndpointResponse;

import java.util.List;

public interface EndpointService {

    List<EndpointResponse> findAll();

    EndpointResponse findById(Long id);

    EndpointResponse create(CreateEndpointRequest request);

    EndpointResponse update(Long id, UpdateEndpointRequest request);

    void deleteById(Long id);
}