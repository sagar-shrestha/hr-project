package com.sagar.hr.modules.dto.response;

import com.sagar.hr.privileges.dto.response.PrivilegesResponse;
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
public class ModulesResponse {

    private Long id;
    private String name;
    private String code;
    private Status status;
    private Long screensId;

    @Builder.Default
    private List<PrivilegesResponse> privileges = List.of();
}