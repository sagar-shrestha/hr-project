package com.sagar.hr.endpoint.dto.request;

import com.sagar.hr.util.enums.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CreateEndpointRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String code;

    @NotBlank
    private String urlPattern;

    @NotBlank
    private String httpMethod;

    private Status status;

    private List<ModulePrivilegeRequest> modulePrivileges;
}