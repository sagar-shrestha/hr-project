package com.sagar.hr.util.util;

import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ControllerUtil {

    public static ResponseEntity<GlobalApiResponse> success(HttpStatus status, String message, Object data) {
        return ResponseEntity.status(status).body(GlobalApiResponse.builder()
                .httpStatus(status.value())
                .message(message)
                .data(data)
                .status(true)
                .build());
    }

    public static ResponseEntity<GlobalApiResponse> created(String message, Object data) {
        return success(HttpStatus.CREATED, message, data);
    }

    public static ResponseEntity<GlobalApiResponse> noContent(String message) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(GlobalApiResponse.builder()
                .httpStatus(HttpStatus.NO_CONTENT.value())
                .message(message)
                .data(null)
                .status(true)
                .build());
    }

    public static ResponseEntity<GlobalApiResponse> ok(String message, Object data) {
        return success(HttpStatus.OK, message, data);
    }
}
