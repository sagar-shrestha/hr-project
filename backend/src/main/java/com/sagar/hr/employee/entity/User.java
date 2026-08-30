package com.sagar.hr.employee.entity;

import com.sagar.hr.security.model.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

/**
 * Login account in the {@code users} SINGLE_TABLE hierarchy.
 *
 * A row with {@code user_type = 'USER'} is instantiated as this class.
 * Extends {@link Employee}, so an account may also carry HR profile fields
 * (inherited) on the same row. Distinguish an account that has a profile by
 * the presence of profile data (e.g. {@code name != null}), since a
 * {@code User} is always an {@code Employee} in Java terms.
 */
@Entity
@DiscriminatorValue("USER")
@Getter
@Setter
@ToString(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends Employee {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "users_roles_association", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}
