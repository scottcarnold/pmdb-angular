package org.xandercat.pmdba.controller;

import java.security.Principal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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
}
