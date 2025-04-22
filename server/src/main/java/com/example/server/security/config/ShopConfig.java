package com.example.server.security.config;

import com.example.server.dto.ReviewDto;
import com.example.server.dto.TaskDto;
import com.example.server.model.Review;
import com.example.server.model.Task;
import com.example.server.security.jwt.AuthTokenFilter;
import com.example.server.security.jwt.JwtAuthEntryPoint;
import com.example.server.security.user.ShopUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class ShopConfig {

    private final ShopUserDetailsService userDetailsService;
    private final JwtAuthEntryPoint authEntryPoint;
    private static final List<String> SECURED_URLS =
            List.of("/api/v1/tasks/**",
                    "/api/v1/images/**",
                    "/api/v1/categories/**",
                    "/api/v1/users/**",
                    "/api/v1/reviews/**",
                    "/api/v1/work-experiences/**");

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        registerMappings(modelMapper);

        return modelMapper;
    }

    private void registerMappings(ModelMapper modelMapper) {
        modelMapper.addMappings(new PropertyMap<Review, ReviewDto>() {
            @Override
            protected void configure() {
                map().setReviewerId(source.getReviewer().getId());
                map().setReviewedUserId(source.getReviewedUser().getId());
                using(reviewerNameConverter()).map(source).setReviewerName(null);
                using(reviewedUserNameConverter()).map(source).setReviewedUserName(null);
            }
        });

        modelMapper.addMappings(new PropertyMap<Task, TaskDto>() {
            @Override
            protected void configure() {
                map().setCategoryId(source.getCategory().getId());
                map().setCategoryName(source.getCategory().getName());
                using(acceptedUserNameConverter()).map(source).setAcceptedUserName(null);
                using(uploadUserNameConverter()).map(source).setUploadUserName(null);
            }
        });
    }

    private Converter<Review, String> reviewerNameConverter() {
        return ctx -> {
            if (ctx.getSource() == null || ctx.getSource().getReviewer() == null) return null;
            var reviewer = ctx.getSource().getReviewer();
            return reviewer.getFirstName() + " " + reviewer.getLastName();
        };
    }

    private Converter<Review, String> reviewedUserNameConverter() {
        return ctx -> {
            if (ctx.getSource() == null || ctx.getSource().getReviewedUser() == null) return null;
            var reviewedUser = ctx.getSource().getReviewedUser();
            return reviewedUser.getFirstName() + " " + reviewedUser.getLastName();
        };
    }

    private Converter<Task, String> acceptedUserNameConverter() {
        return ctx -> {
            if (ctx.getSource() == null || ctx.getSource().getAcceptedUser() == null) return null;
            var acceptedUser = ctx.getSource().getAcceptedUser();
            return acceptedUser.getFirstName() + " " + acceptedUser.getLastName();
        };
    }

    private Converter<Task, String> uploadUserNameConverter() {
        return ctx -> {
            if (ctx.getSource() == null || ctx.getSource().getUploaduser() == null) return null;
            var uploadUser = ctx.getSource().getUploaduser();
            return uploadUser.getFirstName() + " " + uploadUser.getLastName();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->auth.requestMatchers(SECURED_URLS.toArray(String[]::new)).authenticated()
                        .anyRequest().permitAll());
        http.authenticationProvider(daoAuthenticationProvider());
        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }


}
