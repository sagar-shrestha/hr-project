package com.sagar.hr.leave.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ApproveRejectRequest {

    @NotNull
    private Long id;
    private String remarks;
}
