package com.sagar.hr.department.exception;

import com.sagar.hr.util.exception.NotFoundException;

public class DepartmentNotFoundException extends NotFoundException {

    public DepartmentNotFoundException(String message) {
        super(message);
    }
}
