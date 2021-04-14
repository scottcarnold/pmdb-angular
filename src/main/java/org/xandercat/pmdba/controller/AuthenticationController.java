package org.xandercat.pmdba.controller;

import java.security.Principal;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.xandercat.pmdba.config.SecurityConfig;

@RestController
public class AuthenticationController {

	private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfig.class);
	
	@RequestMapping("/user")
	public Principal user(Principal user, @RequestHeader HttpHeaders headers) {
		headers.forEach((key, value) -> LOGGER.info(key + ":" + value.stream().collect(Collectors.joining(","))));
		return user;
	}
}
