package org.xandercat.pmdba.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

// TODO: This class is just here for debugging purposes; it should be removed at some point
@Component
public class MyApplicationListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MyApplicationListener.class);
	
	@Override
	public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
		Object userName = event.getAuthentication().getPrincipal();
		Object credentials = event.getAuthentication().getCredentials();
		LOGGER.info("Failed login using USERNAME [" + userName + "]");
		LOGGER.info("Failed login using PASSWORD [" + credentials + "]");
	}
}
