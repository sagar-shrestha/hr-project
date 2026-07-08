package com.sagar.hr.usermanagement.controller;

import com.sagar.hr.security.dto.request.SignupRequest;
import com.sagar.hr.usermanagement.dto.request.UpdateUserRequest;
import com.sagar.hr.usermanagement.dto.response.UserResponse;
import com.sagar.hr.usermanagement.service.UserService;
import com.sagar.hr.util.pojo.response.GlobalApiResponse;
import com.sagar.hr.util.util.ControllerUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ControllerUtil.ok("Users retrieved", users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ControllerUtil.ok("User retrieved", user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        UserResponse user = userService.updateUser(id, request);
        return ControllerUtil.ok("User updated", user);
    }

    @PostMapping
    public ResponseEntity<GlobalApiResponse> createUser(@Valid @RequestBody SignupRequest signUpRequest) {
        UserResponse user = userService.createUser(signUpRequest);
        return ControllerUtil.created("User created", user);
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<GlobalApiResponse> updateRoles(@PathVariable Long id, @RequestBody Set<String> roles) {
        UserResponse user = userService.updateUserRoles(id, roles);
        return ControllerUtil.ok("Roles updated", user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ControllerUtil.noContent("User deleted");
    }
}
