package com.sagar.hr.privileges.exception;

import com.sagar.hr.util.exception.NotFoundException;

public class PrivilegesNotFoundException extends NotFoundException {

    public PrivilegesNotFoundException(String message) {
        super(message);
    }
}
