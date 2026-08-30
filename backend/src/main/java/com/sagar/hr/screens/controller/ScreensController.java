package com.sagar.hr.screens.controller;

import com.sagar.hr.screens.dto.request.CreateScreensRequest;
import com.sagar.hr.screens.dto.request.UpdateScreensRequest;
import com.sagar.hr.screens.service.ScreensService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/screens")
@RequiredArgsConstructor
public class ScreensController {

    private final ScreensService screensService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        return ControllerUtil.ok("Screens retrieved", screensService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        return ControllerUtil.ok("Screen retrieved", screensService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> create(@Valid @RequestBody CreateScreensRequest request) {
        return ControllerUtil.created("Screen created", screensService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateScreensRequest request) {
        return ControllerUtil.ok("Screen updated", screensService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        screensService.deleteById(id);
        return ControllerUtil.noContent("Screen deleted");
    }
}
