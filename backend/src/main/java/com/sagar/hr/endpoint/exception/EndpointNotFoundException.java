package com.sagar.hr.endpoint.exception;

import com.sagar.hr.util.exception.NotFoundException;

public class EndpointNotFoundException extends NotFoundException {

    public EndpointNotFoundException(String message) {
        super(message);
    }
}