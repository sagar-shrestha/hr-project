package com.sagar.hr.util.audit;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return new AuditorAwareImpl();
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer hibernateLazySerializationCustomizer() {
        return builder -> builder.modulesToInstall(new Hibernate6Module()
                .enable(Hibernate6Module.Feature.FORCE_LAZY_LOADING));
    }
}
