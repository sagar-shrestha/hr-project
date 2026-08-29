package com.sagar.hr.security.model;

import com.sagar.hr.util.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "endpoint_roles")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class EndpointRole extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String urlPattern;

    @Column(nullable = false)
    private String httpMethod;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    public EndpointRole(String urlPattern, String httpMethod, Role role) {
        this.urlPattern = urlPattern;
        this.httpMethod = httpMethod;
        this.role = role;
    }
}
