package com.sagar.hr.modules.exception;

import com.sagar.hr.util.exception.NotFoundException;

public class ModulesNotFoundException extends NotFoundException {

    public ModulesNotFoundException(String message) {
        super(message);
    }
}
