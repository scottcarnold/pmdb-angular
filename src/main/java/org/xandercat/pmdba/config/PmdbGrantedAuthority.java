package org.xandercat.pmdba.config;

import org.springframework.security.core.GrantedAuthority;

/**
 * Enumeration class for application roles.
 * 
 * @author Scott Arnold
 */
public enum PmdbGrantedAuthority implements GrantedAuthority {

	ROLE_USER, ROLE_ADMIN;

	@Override
	public String getAuthority() {
		return name();
	}
}
