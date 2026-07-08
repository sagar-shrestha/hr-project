package com.sagar.hr.endpointrole.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EndpointRoleResponse {

    private Long id;
    private String urlPattern;
    private String httpMethod;
    private String roleName;
}
