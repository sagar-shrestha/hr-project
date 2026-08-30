package com.sagar.hr.endpoint.dto.response;

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
public class EndpointModulePrivilegeResponse {

    private Long moduleId;
    private String moduleName;
    private String moduleCode;
    private Long privilegeId;
    private String privilegeName;
    private String privilegeCode;
}