package org.xandercat.pmdba.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xandercat.pmdba.dao.KeyGenerator;
import org.xandercat.pmdba.dao.MovieDao;
import org.xandercat.pmdba.dao.repository.DynamoMovieRepository;
import org.xandercat.pmdba.dto.Movie;
import org.xandercat.pmdba.dto.MovieCollection;
import org.xandercat.pmdba.dto.MovieCollectionInfo;
import org.xandercat.pmdba.exception.WebServicesException;
import org.xandercat.pmdba.exception.CollectionSharingException;
import org.xandercat.pmdba.util.ApplicationProperties;

@Component
public class MovieServiceImpl implements MovieService {

	@Autowired
	private MovieDao movieDao;

	@Autowired
	private DynamoMovieRepository dynamoMovieRepository;
	
	@Autowired
	private CollectionService collectionService;
	
	@Autowired
	private KeyGenerator keyGenerator;
	
	@Autowired
	private ApplicationProperties applicationProperties;
	
	private void assertCloudReady(MovieCollectionInfo movieCollectionInfo) throws WebServicesException {
		assertCloudReady(movieCollectionInfo.getMovieCollection());
	}
	
	private void assertCloudReady(MovieCollection movieCollection) throws WebServicesException {
		if (!applicationProperties.isAwsEnabled() && movieCollection.isCloud()) {
			throw new WebServicesException("Cloud services are disabled.");
		}
		return;
	}
	
	@Override
	public List<Movie> getMoviesForCollection(String collectionId, String callingUsername) throws CollectionSharingException, WebServicesException {
		MovieCollectionInfo movieCollection = collectionService.assertCollectionViewable(collectionId, callingUsername);
		assertCloudReady(movieCollection);
		if (movieCollection.getMovieCollection().isCloud()) {
			try {
				return dynamoMovieRepository.findByCollectionId(collectionId);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			return movieDao.getMoviesForCollection(collectionId);
		}
	}

	@Override
	public List<Movie> searchMoviesForCollection(String collectionId, String searchString, String callingUsername) throws CollectionSharingException, WebServicesException {
		MovieCollectionInfo movieCollection = collectionService.assertCollectionViewable(collectionId, callingUsername);
		assertCloudReady(movieCollection);
		if (movieCollection.getMovieCollection().isCloud()) {
			try {
				return dynamoMovieRepository.searchMoviesForCollection(collectionId, searchString).stream().collect(Collectors.toList());
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			return movieDao.searchMoviesForCollection(collectionId, searchString);
		}		
	}

	@Override
	public Optional<Movie> getPublicMovie(String id) throws CollectionSharingException, WebServicesException {
		// doing a blind retrieve here; if not in local db, then try AWS
		Optional<Movie> movie = movieDao.getMovie(id);
		if (!movie.isPresent() && applicationProperties.isAwsEnabled()) {
			try {
				Optional<Movie> optional = dynamoMovieRepository.findById(id);
				if (optional.isPresent()) {
					movie = optional;
				}
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		}
		if (movie.isPresent()) {
			// next call will throw the correct exception if collection is not publicly viewable
			collectionService.getPublicMovieCollection(movie.get().getCollectionId());
		}
		return movie;
	}

	@Override
	public Optional<Movie> getMovie(String id, String callingUsername) throws CollectionSharingException, WebServicesException {
		// doing a blind retrieve here; if not in local db, then try AWS
		Optional<Movie> movie = movieDao.getMovie(id);
		if (!movie.isPresent() && applicationProperties.isAwsEnabled()) {
			try {
				Optional<Movie> optional = dynamoMovieRepository.findById(id);
				if (optional.isPresent()) {
					movie = optional;
				}
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		}
		if (movie.isPresent()) {
			collectionService.assertCollectionViewable(movie.get().getCollectionId(), callingUsername);
		}
		return movie;
	}

	@Override
	public void addMovie(Movie movie, String callingUsername) throws CollectionSharingException, WebServicesException {
		MovieCollectionInfo movieCollection = collectionService.assertCollectionEditable(movie.getCollectionId(), callingUsername);
		assertCloudReady(movieCollection);
		if (movieCollection.getMovieCollection().isCloud()) {
			try {
				movie.setId(keyGenerator.getKey());
				dynamoMovieRepository.save(movie);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			movieDao.addMovie(movie);
		}
	}

	@Override
	public void updateMovie(Movie movie, String callingUsername) throws CollectionSharingException, WebServicesException {
		Optional<Movie> oldMovie = getMovie(movie.getId(), callingUsername);
		if (!oldMovie.isPresent()) {
			throw new CollectionSharingException("Movie of given ID does not exist and cannot be updated.");
		}
		if (!oldMovie.get().getCollectionId().equals(movie.getCollectionId())) {
			throw new CollectionSharingException("Changing movie collection ID is not allowed.");
		}
		MovieCollectionInfo movieCollection = collectionService.assertCollectionEditable(movie.getCollectionId(), callingUsername);
		assertCloudReady(movieCollection);
		if (movieCollection.getMovieCollection().isCloud()) {
			try {
				dynamoMovieRepository.save(movie);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			movieDao.updateMovie(movie);
		}
	}

	@Override
	public void deleteMovie(String id, String callingUsername) throws CollectionSharingException, WebServicesException {
		// doing a blind retrieve here; if not in local db, then try AWS
		Optional<Movie> movie = movieDao.getMovie(id);
		if ((!movie.isPresent()) && applicationProperties.isAwsEnabled()) {
			try {
				Optional<Movie> optional = dynamoMovieRepository.findById(id);
				if (optional.isPresent()) {
					movie = optional;
				}
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		}		
		MovieCollectionInfo movieCollection = collectionService.assertCollectionEditable(movie.get().getCollectionId(), callingUsername);
		if (movieCollection.getMovieCollection().isCloud()) {
			try {
				dynamoMovieRepository.delete(movie.get());
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			movieDao.deleteMovie(id);
		}
	}

	@Override
	public List<String> getTableColumnPreferences(String callingUsername) {
		return movieDao.getTableColumnPreferences(callingUsername);
	}

	@Override
	public void addTableColumnPreference(String attributeName, String callingUsername) {
		movieDao.addTableColumnPreference(attributeName, callingUsername);
		
	}

	@Override
	public void reorderTableColumnPreference(int sourceIdx, int targetIdx, String callingUsername) {
		if (sourceIdx == targetIdx) {
			return;
		}
		Optional<Integer> max = movieDao.getMaxTableColumnPreferenceIndex(callingUsername);
		if (!max.isPresent()) {
			throw new IllegalArgumentException("User has no preferences to reorder.");
		}
		if (sourceIdx < 0 || targetIdx < 0 || sourceIdx > max.get() || targetIdx > max.get()) {
			throw new IllegalArgumentException("source index or target index do not fall in acceptable range of 0 to " + max);
		}
		movieDao.reorderTableColumnPreference(sourceIdx, targetIdx, callingUsername);
	}

	@Override
	public void deleteTableColumnPreference(int sourceIdx, String callingUsername) {
		movieDao.deleteTableColumnPreference(sourceIdx, callingUsername);
	}

	@Override
	public List<String> getAttributeKeysForCollection(String collectionId, String callingUsername) throws CollectionSharingException, WebServicesException {
		MovieCollectionInfo movieCollection = collectionService.assertCollectionViewable(collectionId, callingUsername);
		List<String> attributeKeys = null;
		assertCloudReady(movieCollection);
		if (movieCollection.getMovieCollection().isCloud()) {
			try {
				attributeKeys = dynamoMovieRepository.getAttributeKeysForCollection(collectionId);
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			attributeKeys = movieDao.getAttributeKeysForCollection(collectionId);
		}
		Collections.sort(attributeKeys);
		return attributeKeys;
	}

	@Override
	public Set<String> getImdbIdsInDefaultCollection(String callingUsername) throws WebServicesException {
		Optional<MovieCollectionInfo> defaultMovieCollectionInfo = collectionService.getDefaultMovieCollection(callingUsername);
		if (!defaultMovieCollectionInfo.isPresent()) {
			return Collections.emptySet();
		}
		MovieCollection defaultMovieCollection = defaultMovieCollectionInfo.get().getMovieCollection();
		assertCloudReady(defaultMovieCollection);
		if (defaultMovieCollection.isCloud()) {
			try {
				return dynamoMovieRepository.getAttributeValuesForCollection(defaultMovieCollection.getId(), ImdbAttribute.IMDB_ID.getKey());
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			return movieDao.getAttributeValuesForCollection(defaultMovieCollection.getId(), ImdbAttribute.IMDB_ID.getKey());
		}		
	}

	@Override
	public List<Movie> getUnlinkedMoviesForDefaultCollection(String callingUsername) throws WebServicesException {
		Optional<MovieCollectionInfo> defaultMovieCollectionInfo = collectionService.getDefaultMovieCollection(callingUsername);
		if (!defaultMovieCollectionInfo.isPresent()) {
			return Collections.emptyList();
		}
		MovieCollection defaultMovieCollection = defaultMovieCollectionInfo.get().getMovieCollection();
		assertCloudReady(defaultMovieCollection);
		if (defaultMovieCollection.isCloud()) {
			try {
				return dynamoMovieRepository.getMoviesWithoutAttribute(defaultMovieCollection.getId(), ImdbAttribute.IMDB_ID.getKey());
			} catch (Exception e) {
				throw new WebServicesException(e);
			}
		} else {
			return movieDao.getMoviesWithoutAttribute(defaultMovieCollection.getId(), ImdbAttribute.IMDB_ID.getKey());
		}
	}
}
