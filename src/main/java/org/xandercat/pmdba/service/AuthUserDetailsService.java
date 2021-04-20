package org.xandercat.pmdba.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.xandercat.pmdba.dao.AuthDao;
import org.xandercat.pmdba.dao.UserDao;
import org.xandercat.pmdba.dto.PmdbUser;

/**
 * User details service for use by Spring security when loading user information.
 * 
 * @author Scott Arnold
 */
@Component
public class AuthUserDetailsService implements UserDetailsService {

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private AuthDao authDao;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<PmdbUser> user = userDao.getUser(username);
		if (!user.isPresent()) {
			throw new UsernameNotFoundException("User " + username + " not found.");
		}
		user.get().setGrantedAuthorities(authDao.getAuthorities(username));
		return user.get();
	}

}
