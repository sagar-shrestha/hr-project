package com.sagar.hr.privileges.dto.response;

import com.sagar.hr.util.enums.Status;
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
public class PrivilegesResponse {

    private Long id;
    private String name;
    private String code;
    private Status status;
}
