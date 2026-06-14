package com.sagar.hr.util.pojo.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalApiResponse {

    private Integer httpStatus;
    private String message;
    private Object data;
    private boolean status;
}
