package org.xandercat.pmdba.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.xandercat.pmdba.dto.CollectionPermission;
import org.xandercat.pmdba.dto.MovieCollection;
import org.xandercat.pmdba.dto.MovieCollectionInfo;

@Component
public class CollectionDaoImpl implements CollectionDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private KeyGenerator keyGenerator;
	
	@Override
	public List<MovieCollectionInfo> getViewableMovieCollections(String username) {
		return getSharedMovieCollections(username, true);
	}
	
	@Override
	public List<MovieCollectionInfo> getShareOfferMovieCollections(String username) {
		return getSharedMovieCollections(username, false);
	}

	@Override
	public Optional<MovieCollection> getMovieCollection(String collectionId) {
		final String sql = "SELECT id, name, owner, cloud, publicView FROM collection"
				+ " WHERE id = ?";
		final List<MovieCollection> movieCollections = new ArrayList<MovieCollection>();
		jdbcTemplate.query(sql, ps -> {
			ps.setString(1, collectionId);
		}, rs -> {
			MovieCollection movieCollection = new MovieCollection();
			movieCollection.setId(rs.getString(1));
			movieCollection.setName(rs.getString(2));
			movieCollection.setOwner(rs.getString(3));
			movieCollection.setCloud(rs.getBoolean(4));
			movieCollection.setPublicView(rs.getBoolean(5));
			movieCollections.add(movieCollection);
		});
		return movieCollections.stream().findFirst();
	}

	private List<MovieCollectionInfo> getSharedMovieCollections(String username, boolean accepted) {
		final String sql = "SELECT id, name, owner, cloud, allowEdit, publicView FROM collection"
				+ " INNER JOIN collection_permission ON collection.id = collection_permission.collection_id"
				+ " WHERE username = ? AND accepted = ?";
		final List<MovieCollectionInfo> movieCollectionInfos = new ArrayList<MovieCollectionInfo>();
		jdbcTemplate.query(sql, ps -> {
			ps.setString(1, username);
			ps.setBoolean(2, accepted);
		}, rs -> {
			MovieCollectionInfo movieCollectionInfo = new MovieCollectionInfo();
			MovieCollection movieCollection = new MovieCollection();
			movieCollection.setId(rs.getString(1));
			movieCollection.setName(rs.getString(2));
			movieCollection.setOwner(rs.getString(3));
			movieCollection.setCloud(rs.getBoolean(4));
			movieCollection.setPublicView(rs.getBoolean(6));
			movieCollectionInfo.setMovieCollection(movieCollection);
			movieCollectionInfo.setOwned(movieCollection.getOwner().equals(username));
			movieCollectionInfo.setEditable(rs.getBoolean(5));
			movieCollectionInfos.add(movieCollectionInfo);
		});
		return movieCollectionInfos;
	}

	@Override
	public Optional<MovieCollectionInfo> getViewableMovieCollection(String collectionId, String username) {
		return getViewableMovieCollections(username).stream()
				.filter(movieCollectionInfo -> movieCollectionInfo.getMovieCollection().getId().equals(collectionId))
				.findAny();
	}

	@Override
	@Transactional
	public void addMovieCollection(MovieCollection movieCollection) {
		final String sql = "INSERT INTO collection (id, name, owner, cloud, publicView) VALUES (?, ?, ?, ?, ?)";
		movieCollection.setId(keyGenerator.getKey());
		jdbcTemplate.update(sql, ps -> {
			ps.setString(1, movieCollection.getId());
			ps.setString(2, movieCollection.getName());
			ps.setString(3, movieCollection.getOwner());
			ps.setBoolean(4, movieCollection.isCloud());
			ps.setBoolean(5, movieCollection.isPublicView());
		});
		shareCollection(movieCollection.getId(), movieCollection.getOwner(), true);
		acceptShareOffer(movieCollection.getId(), movieCollection.getOwner());
	}

	@Override
	public void updateMovieCollection(MovieCollection movieCollection) {
		final String sql = "UPDATE collection SET name = ?, publicView = ? WHERE id = ?";
		jdbcTemplate.update(sql, ps -> {
			ps.setString(1, movieCollection.getName());
			ps.setBoolean(2, movieCollection.isPublicView());
			ps.setString(3, movieCollection.getId());
		});
	}

	@Override
	@Transactional
	public void deleteMovieCollection(String collectionId) {
		final String sql = "DELETE FROM collection WHERE id = ?";
		final String shareSql = "DELETE FROM collection_permission WHERE collection_id = ?";
		final String defSql = "DELETE FROM collection_default WHERE collection_id = ?";
		jdbcTemplate.update(shareSql, ps -> ps.setString(1, collectionId));
		jdbcTemplate.update(defSql, ps -> ps.setString(1, collectionId));
		jdbcTemplate.update(sql, ps -> ps.setString(1, collectionId));
	}

	@Override
	public void shareCollection(String collectionId, String username, boolean editable) {
		final String sql = "INSERT INTO collection_permission(collection_id, username, allowEdit, accepted) VALUES (?, ?, ?, ?)";
		jdbcTemplate.update(sql, ps -> {
			ps.setString(1, collectionId);
			ps.setString(2, username);
			ps.setBoolean(3, editable);
			ps.setBoolean(4, false);
		});
	}

	@Override
	public void updateEditable(String collectionId, String username, boolean editable) {
		final String sql = "UPDATE collection_permission SET allowEdit = ? WHERE collection_id = ? AND username = ?";
		jdbcTemplate.update(sql, ps -> {
			ps.setBoolean(1, editable);
			ps.setString(2, collectionId);
			ps.setString(3, username);
		});
	}

	@Override
	@Transactional
	public boolean unshareCollection(String collectionId, String username) {
		final String sql = "DELETE FROM collection_permission WHERE collection_id = ? AND username = ?";
		final String defSql = "DELETE FROM collection_default WHERE collection_id = ? AND username = ?"; // may or may not exist
		jdbcTemplate.update(defSql, ps -> {
			ps.setString(1, collectionId);
			ps.setString(2, username);
		});	
		int rowsAffected = jdbcTemplate.update(sql, ps -> {
			ps.setString(1, collectionId);
			ps.setString(2, username);
		});
		return rowsAffected > 0;
	}

	@Override
	public Optional<String> getDefaultCollectionId(String username) {
		final String sql = "SELECT collection_id FROM collection_default WHERE username = ?";
		List<String> ids = new ArrayList<String>();
		jdbcTemplate.query(sql, ps -> ps.setString(1, username), rs -> {
			ids.add(rs.getString(1));
		});
		return ids.stream().findAny();
	}

	@Override
	public void setDefaultCollection(String username, String collectionId) {
		Optional<String> currentDefault = getDefaultCollectionId(username);
		final String insertSql = "INSERT INTO collection_default(collection_id, username) VALUES (?, ?)";
		final String updateSql = "UPDATE collection_default SET collection_id = ? WHERE username = ?";
		String sql = (currentDefault.isPresent())? updateSql : insertSql;
		jdbcTemplate.update(sql, ps -> {
			ps.setString(1, collectionId);
			ps.setString(2, username);
		});
	}

	@Override
	public boolean acceptShareOffer(String collectionId, String username) {
		final String sql = "UPDATE collection_permission SET accepted = 1 WHERE collection_id = ? AND username = ?";
		int rowsAffected = jdbcTemplate.update(sql, ps -> {
			ps.setString(1, collectionId);
			ps.setString(2, username);
		});
		return rowsAffected > 0;
	}

	@Override
	@Transactional
	public List<CollectionPermission> getCollectionPermissions(String collectionId) {
		final String ownerSql = "SELECT owner FROM collection WHERE id = ?";
		String owner = jdbcTemplate.queryForObject(ownerSql, String.class, collectionId);
		final String sql = "SELECT username, allowEdit, accepted FROM collection_permission WHERE collection_id = ? AND username <> ?";
		final List<CollectionPermission> permissions = new ArrayList<CollectionPermission>();
		jdbcTemplate.query(sql, ps -> {
			ps.setString(1, collectionId);
			ps.setString(2, owner);
		}, rs -> {
			CollectionPermission permission = new CollectionPermission();
			permission.setCollectionId(collectionId);
			permission.setUsername(rs.getString(1));
			permission.setAllowEdit(rs.getBoolean(2));
			permission.setAccepted(rs.getBoolean(3));
			permissions.add(permission);
		});
		return permissions;
	}

	@Override
	public Optional<CollectionPermission> getCollectionPermission(String collectionId, String username) {
		return getCollectionPermissions(collectionId).stream()
				.filter(permission -> permission.getUsername().equals(username))
				.findAny();
	}
}
