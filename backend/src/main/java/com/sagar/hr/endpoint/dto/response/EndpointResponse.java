package com.sagar.hr.endpoint.dto.response;

import com.sagar.hr.util.enums.Status;
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
public class EndpointResponse {

    private Long id;
    private String name;
    private String code;
    private String urlPattern;
    private String httpMethod;
    private Status status;

    @Builder.Default
    private List<EndpointModulePrivilegeResponse> modulePrivileges = List.of();
}