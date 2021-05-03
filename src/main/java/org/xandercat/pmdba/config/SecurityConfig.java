package org.xandercat.pmdba.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfig.class);
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		LOGGER.info("Configuring user authentication...");
		//auth.inMemoryAuthentication().withUser("user").password(passwordEncoder().encode("password")).roles("USER");
		auth.userDetailsService(userDetailsService);
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		LOGGER.info("Configuring HTTP Security...");
		http
			.httpBasic()
			.and().cors()
			.and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
			.and().authorizeRequests()
				.antMatchers("/login*").permitAll()
				.antMatchers("/*.css").permitAll()
				.antMatchers("/*.js").permitAll()
				.antMatchers("/*.js.map").permitAll()
				.antMatchers("/index.html").permitAll()
				.antMatchers("/favicon.ico").permitAll()
				.antMatchers("/**").hasRole("USER");
				
	}
}
