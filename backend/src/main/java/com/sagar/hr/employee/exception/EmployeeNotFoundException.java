package com.sagar.hr.employee.exception;

import com.sagar.hr.util.exception.NotFoundException;

public class EmployeeNotFoundException extends NotFoundException {

    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
