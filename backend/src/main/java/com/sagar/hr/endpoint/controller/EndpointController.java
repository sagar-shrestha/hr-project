package com.sagar.hr.endpoint.controller;

import com.sagar.hr.endpoint.dto.request.CreateEndpointRequest;
import com.sagar.hr.endpoint.dto.request.UpdateEndpointRequest;
import com.sagar.hr.endpoint.service.EndpointService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/endpoints")
@RequiredArgsConstructor
public class EndpointController {

    private final EndpointService endpointService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAll() {
        return ControllerUtil.ok("Endpoints retrieved", endpointService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getById(@PathVariable Long id) {
        return ControllerUtil.ok("Endpoint retrieved", endpointService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> saveEndpoint(@Valid @RequestBody CreateEndpointRequest request) {
        return ControllerUtil.created("Endpoint saved", endpointService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateEndpointRequest request) {
        return ControllerUtil.ok("Endpoint updated", endpointService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> delete(@PathVariable Long id) {
        endpointService.deleteById(id);
        return ControllerUtil.noContent("Endpoint deleted");
    }
}