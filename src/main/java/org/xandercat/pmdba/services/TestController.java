package org.xandercat.pmdba.services;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TestController.class);
	
	@RequestMapping("/test")
	public String test(@RequestHeader HttpHeaders headers) {
		headers.forEach((key, value) -> LOGGER.info(key + ":" + value.stream().collect(Collectors.joining(","))));
		return "Hello Backend Service!";
	}
}
