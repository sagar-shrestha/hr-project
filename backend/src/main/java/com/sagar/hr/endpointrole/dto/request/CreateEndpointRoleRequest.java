package com.sagar.hr.endpointrole.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CreateEndpointRoleRequest {

    @NotBlank
    private String urlPattern;

    @NotBlank
    private String httpMethod;

    @NotBlank
    private String roleName;
}
