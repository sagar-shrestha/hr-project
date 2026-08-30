package com.sagar.hr.screens.service;

import com.sagar.hr.screens.dto.request.CreateScreensRequest;
import com.sagar.hr.screens.dto.request.UpdateScreensRequest;
import com.sagar.hr.screens.dto.response.ScreensResponse;

import java.util.List;

public interface ScreensService {

    List<ScreensResponse> findAll();

    ScreensResponse findById(Long id);

    ScreensResponse create(CreateScreensRequest request);

    ScreensResponse update(Long id, UpdateScreensRequest request);

    void deleteById(Long id);
}
