package org.xandercat.pmdba.dao;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.xandercat.pmdba.dto.PmdbUser;
import org.xandercat.pmdba.util.DBUtil;
import org.xandercat.pmdba.util.FormatUtil;

@Component
public class UserDaoImpl implements UserDao {
	
	private static final Logger LOGGER = LogManager.getLogger(UserDaoImpl.class);
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	@Transactional
	public void addUser(PmdbUser user, String unencryptedPassword) {
		addUser(user, unencryptedPassword, false);
	}
	
	@Override
	@Transactional
	public void readdUser(PmdbUser user) {
		addUser(user, null, true);
	}
	
	private void addUser(PmdbUser user, String unencryptedPassword, boolean readd) {
		LOGGER.debug("Request to add user: " + user.getUsername());
		if (FormatUtil.isBlank(user.getUsername())) {
			throw new IllegalArgumentException("Username cannot be empty.");
		}
		if (!readd && FormatUtil.isBlank(unencryptedPassword)) {
			throw new IllegalArgumentException("Password cannot be empty.");
		}
		String encryptedPassword = readd? user.getPassword() : passwordEncoder.encode(unencryptedPassword);
		final String sql = "INSERT INTO users(username, password, enabled) VALUES (?, ?, ?)";
		jdbcTemplate.update(sql, ps -> {
			ps.setString(1, user.getUsername());
			ps.setBytes(2, encryptedPassword.getBytes());
			ps.setBoolean(3, user.isEnabled());
		});
		user.setPassword(encryptedPassword);
		final String detailsSql = "INSERT INTO user_details(username, firstName, lastName, email, createdTs, updatedTs) VALUES (?, ?, ?, ?, ?, ?)";
		Date now = new Date();
		jdbcTemplate.update(detailsSql, ps -> {
			ps.setString(1, user.getUsername());
			ps.setString(2, user.getFirstName());
			ps.setString(3, user.getLastName());
			ps.setString(4, user.getEmail());
			DBUtil.setGMTTimestamp(ps, 5, now);
			DBUtil.setGMTTimestamp(ps, 6, now);
		});
	}

	@Override
	@Transactional
	public void saveUser(PmdbUser user) {
		LOGGER.debug("Request to save user: " + user.getUsername());
		final String sql = "UPDATE users SET enabled = ? WHERE username = ?";
		jdbcTemplate.update(sql, ps -> {
			ps.setBoolean(1, user.isEnabled());
			ps.setString(2, user.getUsername());
		});
		final String detailsSql = "UPDATE user_details SET firstName = ?, lastName = ?, email = ?, updatedTs = ?"
				+ " WHERE username = ?";
		Date now = new Date();
		jdbcTemplate.update(detailsSql, ps -> {
			ps.setString(1, user.getFirstName());
			ps.setString(2, user.getLastName());
			ps.setString(3, user.getEmail());
			DBUtil.setGMTTimestamp(ps, 4, now);
			ps.setString(5, user.getUsername());
		});
	}

	@Override
	public String changePassword(String username, String newPassword) {
		final String sql = "UPDATE users SET password = ? WHERE username = ?";
		String encryptedPassword = passwordEncoder.encode(newPassword);
		jdbcTemplate.update(sql, ps -> {
			ps.setBytes(1, encryptedPassword.getBytes());
			ps.setString(2, username);
		});
		return encryptedPassword;
	}

	@Override
	public Optional<PmdbUser> getUser(String username) {
		LOGGER.debug("Request to get user: " + username);
		List<PmdbUser> pmdbUsers = new ArrayList<PmdbUser>();
		final String sql = "SELECT users.username, password, enabled, firstName, lastName, email, createdTs, updatedTs, lastAccessTs FROM users"
				+ " INNER JOIN user_details ON users.username = user_details.username"
				+ " WHERE users.username = ?";
		jdbcTemplate.query(sql, ps -> ps.setString(1, username), rs-> {
			PmdbUser pmdbUser = new PmdbUser();
			pmdbUser.setUsername(rs.getString(1));
			try {
				pmdbUser.setPassword(new String(rs.getBytes(2), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				LOGGER.error("Unable to read password hash from database.", e);
			} 
			pmdbUser.setEnabled(rs.getBoolean(3));
			pmdbUser.setFirstName(rs.getString(4));
			pmdbUser.setLastName(rs.getString(5));
			pmdbUser.setEmail(rs.getString(6));
			pmdbUser.setCreatedDate(DBUtil.getDateFromGMTTimestamp(rs, 7));
			pmdbUser.setUpdatedDate(DBUtil.getDateFromGMTTimestamp(rs, 8));
			pmdbUser.setLastAccessDate(DBUtil.getDateFromGMTTimestamp(rs, 9));
			pmdbUsers.add(pmdbUser);
		});
		return pmdbUsers.stream().findAny();
	}

	@Override
	public Optional<PmdbUser> getUserByEmail(String email) {
		LOGGER.debug("Request to get user by email: " + email);
		List<PmdbUser> pmdbUsers = new ArrayList<PmdbUser>();
		final String sql = "SELECT users.username, password, enabled, firstName, lastName, email, createdTs, updatedTs, lastAccessTs FROM users"
				+ " INNER JOIN user_details ON users.username = user_details.username"
				+ " WHERE user_details.email = ?";
		jdbcTemplate.query(sql, ps -> ps.setString(1, email), rs -> {
			PmdbUser pmdbUser = new PmdbUser();
			pmdbUser.setUsername(rs.getString(1));
			try {
				pmdbUser.setPassword(new String(rs.getBytes(2), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				LOGGER.error("Unable to read password hash from database.", e);
			} 
			pmdbUser.setEnabled(rs.getBoolean(3));
			pmdbUser.setFirstName(rs.getString(4));
			pmdbUser.setLastName(rs.getString(5));
			pmdbUser.setEmail(rs.getString(6));
			pmdbUser.setCreatedDate(DBUtil.getDateFromGMTTimestamp(rs, 7));
			pmdbUser.setUpdatedDate(DBUtil.getDateFromGMTTimestamp(rs, 8));
			pmdbUser.setLastAccessDate(DBUtil.getDateFromGMTTimestamp(rs, 9));
			pmdbUsers.add(pmdbUser);
		});
		return (pmdbUsers.size() == 1)? pmdbUsers.stream().findAny() : Optional.empty();
	}
	
	@Override
	public void updateLastAccess(String username) {
		final String sql = "UPDATE user_details SET lastAccessTs = ? WHERE username = ?";
		jdbcTemplate.update(sql, ps -> {
			DBUtil.setGMTTimestamp(ps, 1, new Date());
			ps.setString(2, username);
		});
	}

	@Override
	public int getUserCount() {
		return jdbcTemplate.queryForObject("select count(*) from users", Integer.class).intValue();
	}

	@Override
	public List<PmdbUser> searchUsers(String searchString) {
		final String lcSearchString = searchString.trim().toLowerCase();
		final List<PmdbUser> users = new ArrayList<PmdbUser>();
		final String sql = "SELECT users.username, password, enabled, firstName, lastName, email, createdTs, updatedTs, lastAccessTs FROM users"
				+ " INNER JOIN user_details ON users.username = user_details.username"
				+ " WHERE LOWER(users.username) like ?"
				+ " OR LOWER(user_details.firstName) like ?"
				+ " OR LOWER(user_details.lastName) like ?"
				+ " ORDER BY LOWER(users.username)";
		jdbcTemplate.query(sql, ps -> {
			ps.setString(1, "%" + lcSearchString + "%");
			ps.setString(2, "%" + lcSearchString + "%");
			ps.setString(3, "%" + lcSearchString + "%");
		}, rs -> {
			PmdbUser pmdbUser = new PmdbUser();
			pmdbUser.setUsername(rs.getString(1));
			try {
				pmdbUser.setPassword(new String(rs.getBytes(2), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				LOGGER.error("Unable to read password hash from database.", e);
			} 
			pmdbUser.setEnabled(rs.getBoolean(3));
			pmdbUser.setFirstName(rs.getString(4));
			pmdbUser.setLastName(rs.getString(5));
			pmdbUser.setEmail(rs.getString(6));
			pmdbUser.setCreatedDate(DBUtil.getDateFromGMTTimestamp(rs, 7));
			pmdbUser.setUpdatedDate(DBUtil.getDateFromGMTTimestamp(rs, 8));
			pmdbUser.setLastAccessDate(DBUtil.getDateFromGMTTimestamp(rs, 9));
			users.add(pmdbUser);
		});		
		return users;
	}

	@Override
	@Transactional
	public void delete(String username) {
		final String detailsSql = "DELETE FROM user_details WHERE username = ?";
		final String sql = "DELETE FROM users WHERE username = ?";
		jdbcTemplate.update(detailsSql, ps -> ps.setString(1, username));
		jdbcTemplate.update(sql, ps -> ps.setString(1, username));
	}
}
