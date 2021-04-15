package org.xandercat.pmdba.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.xandercat.pmdba.dao.CollectionDao;
import org.xandercat.pmdba.dao.KeyGenerator;
import org.xandercat.pmdba.dao.MovieDao;
import org.xandercat.pmdba.dao.repository.DynamoCollectionRepository;
import org.xandercat.pmdba.dao.repository.DynamoMovieRepository;
import org.xandercat.pmdba.dto.CollectionPermission;
import org.xandercat.pmdba.dto.Movie;
import org.xandercat.pmdba.dto.MovieCollection;
import org.xandercat.pmdba.dto.MovieCollectionInfo;
import org.xandercat.pmdba.exception.CollectionSharingException;
import org.xandercat.pmdba.exception.WebServicesException;
import org.xandercat.pmdba.util.ApplicationProperties;
import org.xandercat.pmdba.util.ExcelPorter;

@Component
public class CollectionServiceImpl implements CollectionService {

	private static final Logger LOGGER = LogManager.getLogger(CollectionServiceImpl.class);
	
	@Autowired
	private CollectionDao collectionDao;

	@Autowired
	private DynamoCollectionRepository dynamoCollectionRepository;
	
	@Autowired
	private MovieDao movieDao;
	
	@Autowired
	private DynamoMovieRepository dynamoMovieRepository;
	
	@Autowired
	private KeyGenerator keyGenerator;
	
	@Autowired
	private ApplicationProperties applicationProperties;
	
	private void assertCloudReady(MovieCollection movieCollection) throws WebServicesException {
		if (!applicationProperties.isAwsEnabled() && movieCollection.isCloud()) {
			throw new WebServicesException("Cloud services are disabled.");
		}
		return;
	}
	
	@Override
	public Optional<MovieCollectionInfo> getDefaultMovieCollection(String username) {
		Optional<String> collectionId = collectionDao.getDefaultCollectionId(username);
		return collectionId.isPresent()? collectionDao.getViewableMovieCollection(collectionId.get(), username) : Optional.empty();
	}

	@Override
	public void setDefaultMovieCollection(String collectionId, String callingUsername) throws CollectionSharingException {
		assertCollectionViewable(collectionId, callingUsername);		
		collectionDao.setDefaultCollection(callingUsername, collectionId);
		
	}

	@Override
	public List<MovieCollectionInfo> getViewableMovieCollections(String username) {
		return collectionDao.getViewableMovieCollections(username);
	}

	@Override
	public List<MovieCollectionInfo> getShareOfferMovieCollections(String username) {
		return collectionDao.getShareOfferMovieCollections(username);
	}

	@Override
	public MovieCollectionInfo getViewableMovieCollection(String collectionId, String callingUsername)	throws CollectionSharingException {
		Optional<MovieCollectionInfo> movieCollection = collectionDao.getViewableMovieCollection(collectionId, callingUsername);
		if (!movieCollection.isPresent()) {
			throw new CollectionSharingException("User does not have permission to view collection.");
		}
		return movieCollection.get();
	}

	@Override
	public MovieCollection getPublicMovieCollection(String collectionId) throws CollectionSharingException {
		Optional<MovieCollection> movieCollection = collectionDao.getMovieCollection(collectionId);
		if (!movieCollection.isPresent()) {
			throw new CollectionSharingException("Movie collection does not exist.");
		} else if (!movieCollection.get().isPublicView()) {
			throw new CollectionSharingException("Movie collection is not available to public.");
		}
		return movieCollection.get();
	}

	@Override
	public void addMovieCollection(MovieCollection movieCollection, String callingUsername) throws WebServicesException {
		movieCollection.setOwner(callingUsername); // enforce that movie collection owner is the calling username
		assertCloudReady(movieCollection);
		//TODO: Need to consider error control, especially considering the mirroring of movie collections (check other methods too)
		collectionDao.addMovieCollection(movieCollection);
		if (movieCollection.isCloud()) {
			try {
				dynamoCollectionRepository.save(movieCollection);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		}
	}

	@Override
	public void updateMovieCollection(MovieCollection movieCollection, String callingUsername) throws CollectionSharingException, WebServicesException {
		Optional<MovieCollectionInfo> viewableMovieCollectionOptional = collectionDao.getViewableMovieCollection(movieCollection.getId(), callingUsername);
		if (!viewableMovieCollectionOptional.isPresent() || !viewableMovieCollectionOptional.get().isEditable()) { // collection must be editable
			throw new CollectionSharingException("User does not have required permission to update collection.");
		}
		MovieCollection editableMovieCollection = viewableMovieCollectionOptional.get().getMovieCollection();
		assertCloudReady(editableMovieCollection);
		editableMovieCollection.setName(movieCollection.getName());
		editableMovieCollection.setPublicView(movieCollection.isPublicView());
		collectionDao.updateMovieCollection(editableMovieCollection);
		if (editableMovieCollection.isCloud()) {
			try {
				dynamoCollectionRepository.save(editableMovieCollection);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		}
	}

	@Override
	public void deleteMovieCollection(String collectionId, String callingUsername) throws CollectionSharingException, WebServicesException {
		Optional<MovieCollectionInfo> movieCollectionOptional = collectionDao.getViewableMovieCollection(collectionId, callingUsername);
		if (!movieCollectionOptional.isPresent() || !movieCollectionOptional.get().isOwned()) { // only owner can delete collection
			throw new CollectionSharingException("User does not have required permission to delete collection.");
		}
		MovieCollection movieCollection = movieCollectionOptional.get().getMovieCollection();
		assertCloudReady(movieCollection);
		if (movieCollection.isCloud()) {
			try {
				dynamoMovieRepository.deleteByCollectionId(collectionId);
				dynamoCollectionRepository.deleteById(collectionId);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			movieDao.deleteMoviesForCollection(collectionId);
		}
		collectionDao.deleteMovieCollection(collectionId);
	}

	@Override
	public void shareMovieCollection(String collectionId, String shareWithUsername, boolean editable, String callingUsername) throws CollectionSharingException {
		assertCollectionEditable(collectionId, callingUsername);
		collectionDao.shareCollection(collectionId, shareWithUsername, editable);
	}

	@Override
	public void unshareMovieCollection(String collectionId, String unshareWithUsername, String callingUsername) throws CollectionSharingException {
		MovieCollectionInfo movieCollection = null;
		if (callingUsername.equals(unshareWithUsername)) {
			movieCollection = assertCollectionViewable(collectionId, callingUsername);
		} else {
			movieCollection = assertCollectionEditable(collectionId, callingUsername);
		}
		if (movieCollection.getMovieCollection().getOwner().equals(unshareWithUsername)) {
			throw new CollectionSharingException("Collection owner permissions cannot be revoked.");
		}
		collectionDao.unshareCollection(collectionId, unshareWithUsername);
	}

	@Override
	public void updateEditable(String collectionId, String updateUsername, boolean editable, String callingUsername) throws CollectionSharingException {
		MovieCollectionInfo movieCollection = assertCollectionEditable(collectionId, callingUsername);
		if (movieCollection.getMovieCollection().getOwner().equals(updateUsername)) {
			throw new CollectionSharingException("Collection owner permissions cannot be changed.");
		}
		collectionDao.updateEditable(collectionId, updateUsername, editable);
		
	}

	@Override
	public void acceptShareOffer(String collectionId, String callingUsername) throws CollectionSharingException {
		if (!collectionDao.acceptShareOffer(collectionId, callingUsername)) {
			throw new CollectionSharingException("Unable to accept share offer for collection " + collectionId + " user " + callingUsername);
		}
	}

	@Override
	public void declineShareOffer(String collectionId, String callingUsername) throws CollectionSharingException {
		if (!collectionDao.unshareCollection(collectionId, callingUsername)) {
			throw new CollectionSharingException("Unable to decline share offer for collection " + collectionId + " user " + callingUsername);
		}
	}
	
	@Override
	public MovieCollectionInfo assertCollectionViewable(String collectionId, String callingUsername) throws CollectionSharingException {
		Optional<MovieCollectionInfo> movieCollection = collectionDao.getViewableMovieCollection(collectionId, callingUsername);
		if (!movieCollection.isPresent()) { // collection must be viewable
			throw new CollectionSharingException("User does not have required permission to update share permission.");
		}
		return movieCollection.get();
	}

	@Override
	public MovieCollectionInfo assertCollectionEditable(String collectionId, String callingUsername) throws CollectionSharingException {
		Optional<MovieCollectionInfo> movieCollection = collectionDao.getViewableMovieCollection(collectionId, callingUsername);
		if (!movieCollection.isPresent() || !movieCollection.get().isEditable()) { // collection must be editable
			throw new CollectionSharingException("User does not have required permission to update share permission.");
		}
		return movieCollection.get();
	}

	@Override
	public List<CollectionPermission> getCollectionPermissions(String collectionId, String callingUsername) throws CollectionSharingException {
		Optional<MovieCollectionInfo> movieCollection = collectionDao.getViewableMovieCollection(collectionId, callingUsername);
		if (!movieCollection.isPresent() || !movieCollection.get().isOwned()) {
			throw new CollectionSharingException("User can only view sharing permissions of collections they are the owner of.");
		}
		return collectionDao.getCollectionPermissions(collectionId);
	}

	@Override
	public Optional<CollectionPermission> getCollectionPermission(String collectionId, String username, String callingUsername) throws CollectionSharingException {
		Optional<MovieCollectionInfo> movieCollection = collectionDao.getViewableMovieCollection(collectionId, callingUsername);
		if (!movieCollection.isPresent() || !movieCollection.get().isOwned()) {
			throw new CollectionSharingException("User can only view sharing permissions of collections they are the owner of.");
		}
		return collectionDao.getCollectionPermission(collectionId, username);
	}

	@Override
	public void importCollection(MultipartFile mFile, String collectionName, boolean cloud, List<String> sheetNames, List<String> columnNames, String callingUsername) throws IOException {
		long startTime = System.currentTimeMillis();
		ExcelPorter excelImporter = new ExcelPorter(mFile.getInputStream(), mFile.getOriginalFilename());
		List<Movie> movies = new ArrayList<Movie>();
		for (String sheetName : sheetNames) {
			movies.addAll(excelImporter.getMoviesForSheet(sheetName, columnNames));
		}
		long parseTime = System.currentTimeMillis();
		MovieCollection movieCollection = new MovieCollection();
		movieCollection.setName(collectionName);
		movieCollection.setOwner(callingUsername);
		movieCollection.setCloud(cloud);
		movieCollection.setPublicView(false);
		collectionDao.addMovieCollection(movieCollection);
		if (cloud) {
			dynamoCollectionRepository.save(movieCollection); // key will have already been set by mirrored movie collection save
		}
		movies.forEach(movie -> movie.setCollectionId(movieCollection.getId()));
		if (cloud) {
			movies.forEach(movie -> movie.setId(keyGenerator.getKey())); // TODO: Could redefine the DynamoDB table to have auto-generated keys
			dynamoMovieRepository.saveAll(movies);
		} else {
			movieDao.addMovies(movies);
		}
		long storeTime = System.currentTimeMillis();
		LOGGER.info("Time to parse: " + String.valueOf(parseTime - startTime) + "ms; Time to store: " + String.valueOf(storeTime - parseTime) + " ms");
	}
}
