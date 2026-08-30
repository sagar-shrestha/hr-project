package com.sagar.hr.screens.dto.request;

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
public class UpdateScreensRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String code;

    private Status status;

    private List<ModuleRequest> modules;
}
