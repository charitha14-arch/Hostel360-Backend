package com.hostel360.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/students/**").permitAll()
                .requestMatchers("/api/rooms/**").permitAll()
                .requestMatchers("/api/complaints/**").permitAll()
                .requestMatchers("/api/cleaning-requests/**").permitAll()
                .requestMatchers("/api/outing-requests/**").permitAll()
                .requestMatchers("/api/attendance/**").permitAll()
                .requestMatchers("/api/mess-feedback/**").permitAll()
                .requestMatchers("/api/announcements/**").permitAll()
                .requestMatchers("/api/lost-and-found/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .anyRequest().permitAll()
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}