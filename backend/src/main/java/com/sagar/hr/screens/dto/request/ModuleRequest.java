package com.sagar.hr.screens.dto.request;

import com.sagar.hr.util.enums.Status;
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
public class ModuleRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String code;

    private Status status;
}
