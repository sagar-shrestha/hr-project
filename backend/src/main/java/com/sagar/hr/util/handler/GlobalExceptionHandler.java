package com.sagar.hr.util.handler;

import com.sagar.hr.util.exception.AlreadyInUseException;
import com.sagar.hr.util.exception.NotAbleTOAssignException;
import com.sagar.hr.util.exception.NotFoundException;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.sagar.hr.util.util.CommonMessages.SOMETHING_WENT_WRONG;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<GlobalApiResponse> handleNullPointerException(NullPointerException ex) {
        return ResponseEntity.ok(GlobalApiResponse
                .builder()
                .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(SOMETHING_WENT_WRONG)
                .data(null)
                .status(false)
                .build());
    }

    @ExceptionHandler(AlreadyInUseException.class)
    public ResponseEntity<GlobalApiResponse> handleAlreadyInUseException(AlreadyInUseException ex) {
        return ResponseEntity.ok(GlobalApiResponse
                .builder()
                .httpStatus(HttpStatus.IM_USED.value())
                .message(ex.getMessage())
                .data(null)
                .status(false)
                .build());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<GlobalApiResponse> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.ok(GlobalApiResponse
                .builder()
                .httpStatus(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .data(null)
                .status(false)
                .build());
    }

    @ExceptionHandler(NotAbleTOAssignException.class)
    public ResponseEntity<GlobalApiResponse> handleNotAbleTOAssignException(NotAbleTOAssignException ex) {
        return ResponseEntity.ok(GlobalApiResponse
                .builder()
                .httpStatus(HttpStatus.NOT_ACCEPTABLE.value())
                .message(ex.getMessage())
                .data(null)
                .status(false)
                .build());
    }

}
