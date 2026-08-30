package com.sagar.hr.modules.entity;

import com.sagar.hr.privileges.entity.Privileges;
import com.sagar.hr.screens.entity.Screens;
import com.sagar.hr.util.audit.AuditableEntity;
import com.sagar.hr.util.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "modules")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Audited
public class Modules extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screens_id", foreignKey = @ForeignKey(name = "fk_modules_screens_id"))
    private Screens screens;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "modules_privileges_mapping",
            joinColumns = @JoinColumn(name = "module_id"),
            inverseJoinColumns = @JoinColumn(name = "privilege_id"))
    @Builder.Default
    @ToString.Exclude
    private Set<Privileges> privileges = new HashSet<>();
}
