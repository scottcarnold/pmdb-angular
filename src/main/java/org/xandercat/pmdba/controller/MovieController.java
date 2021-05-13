package org.xandercat.pmdba.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.xandercat.pmdba.dto.Movie;
import org.xandercat.pmdba.exception.CollectionSharingException;
import org.xandercat.pmdba.exception.WebServicesException;
import org.xandercat.pmdba.service.MovieService;

@RestController
@RequestMapping("/services/movies")
public class MovieController {

	private static final Logger LOGGER = LoggerFactory.getLogger(MovieController.class);
	
	@Autowired
	private MovieService movieService;
	
	@GetMapping("/allMovies")
	public List<Movie> allMovies(@RequestParam String collectionId, Principal principal) {
		try {
			return movieService.getMoviesForCollection(collectionId, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to get movies for collection.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);			
		} catch (WebServicesException e) {
			LOGGER.error("Unable to get movies for collection.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);			
		}
	}
	
	@GetMapping("/searchMovies")
	public List<Movie> searchMovies(@RequestParam String collectionId, @RequestParam String searchFor, Principal principal) {
		try {
			return movieService.searchMoviesForCollection(collectionId, searchFor, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to search movies for collection.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to search movies for collection.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);	
		}
	}
	
	@GetMapping("/attributeKeys")
	public List<String> attributeKeysForCollection(@RequestParam String collectionId, Principal principal) {
		try {
			return movieService.getAttributeKeysForCollection(collectionId, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to lookup attribute keys for collection.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to lookup attribute keys for collection.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);	
		}
	}
	
	@GetMapping("/getMovie")
	public Movie getMovie(@RequestParam String movieId, Principal principal) {
		try {
			Optional<Movie> movie = movieService.getMovie(movieId, principal.getName());
			if (movie.isPresent()) {
				return movie.get();
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND);
			}
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to get movie.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to get movie.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
	}
	
	@PostMapping("/addMovie")
	public Movie addMovie(@RequestBody Movie movie, Principal principal) {
		try {
			movieService.addMovie(movie, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to add movie.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to add movie.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
		return movie;		
	}
	
	@PostMapping("/updateMovie")
	public boolean updateMovie(@RequestBody Movie movie, Principal principal) {
		try {
			movieService.updateMovie(movie, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to update movie.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to update movie.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
		return true;
	}
	
	@PostMapping("/deleteMovie")
	public void deleteMovie(@RequestBody String movieId, Principal principal) {
		try {
			movieService.deleteMovie(movieId, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to delete movie.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to delete movie.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
	}
	
	@GetMapping("/getTableColumnPreferences")
	public List<String> getTableColumnPreferences(Principal principal) {
		return movieService.getTableColumnPreferences(principal.getName());
	}
	
	@PostMapping("/addTableColumnPreference")
	public void addTableColumnPreference(@RequestBody String attributeName, Principal principal) {
		movieService.addTableColumnPreference(attributeName, principal.getName());
	}
	
	@PostMapping("/deleteTableColumnPreference")
	public void deleteTableColumnPreference(@RequestBody int sourceIdx, Principal principal) {
		movieService.deleteTableColumnPreference(sourceIdx, principal.getName());
	}
	
	@PostMapping("/reorderTableColumnPreference")
	public void reorderTableColumnPreference(@RequestBody int[] sourceAndTargetIdx, Principal principal) {
		if (sourceAndTargetIdx.length != 2) {
			throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY);
		}
		int sourceIdx = sourceAndTargetIdx[0];
		int targetIdx = sourceAndTargetIdx[1];
		movieService.reorderTableColumnPreference(sourceIdx, targetIdx, principal.getName());
	}
}
