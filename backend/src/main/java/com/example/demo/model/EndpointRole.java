package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "endpoint_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EndpointRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String urlPattern;

    @Column(nullable = false)
    private String httpMethod; // GET, POST, PUT, DELETE, etc.

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    public EndpointRole(String urlPattern, String httpMethod, Role role) {
        this.urlPattern = urlPattern;
        this.httpMethod = httpMethod;
        this.role = role;
    }
}
