package org.xandercat.pmdba.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.xandercat.pmdba.dto.MovieCollection;
import org.xandercat.pmdba.dto.MovieCollectionInfo;
import org.xandercat.pmdba.exception.CollectionSharingException;
import org.xandercat.pmdba.exception.WebServicesException;
import org.xandercat.pmdba.service.CollectionService;

@RestController
@RequestMapping("/services/collections")
public class CollectionController {

	private static final Logger LOGGER = LoggerFactory.getLogger(CollectionController.class);
			
	@Autowired
	private CollectionService collectionService;
	
	@RequestMapping("/default")
	public MovieCollectionInfo defaultCollection(Principal principal) {
		Optional<MovieCollectionInfo> movieCollectionInfo = collectionService.getDefaultMovieCollection(principal.getName());
		return movieCollectionInfo.isPresent()? movieCollectionInfo.get() : null;
	}
	
	@RequestMapping("/viewable")
	public List<MovieCollectionInfo> viewableCollections(Principal principal) {
		return collectionService.getViewableMovieCollections(principal.getName());
	}
	
	@PostMapping("/new")
	public MovieCollection newCollection(@RequestBody MovieCollection movieCollection, Principal principal) {
		try {
			if (movieCollection.getName() != null && movieCollection.getName().toLowerCase().startsWith("error")) {
				throw new WebServicesException("Throwing mock WebServicesException.");
			}
			collectionService.addMovieCollection(movieCollection, principal.getName());
			if (!collectionService.getDefaultMovieCollection(principal.getName()).isPresent()) {
				// user currently has no default/current movie collection; set it to the newly created one
				try {
					collectionService.setDefaultMovieCollection(movieCollection.getId(), principal.getName());
				} catch (CollectionSharingException e) {
					// this block shouldn't even be reachable, and it's not fatal, so just log the error and continue on
					LOGGER.error("Unable to set user's default movie collection to the newly created collection.", e);
				}
			}
		} catch (WebServicesException e) {
			LOGGER.error("Unable to add new collection.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
		return movieCollection;
	}
	
	@PostMapping("/delete")
	public void deleteCollection(@RequestBody String movieCollectionId, Principal principal) {
		try {
			collectionService.deleteMovieCollection(movieCollectionId, principal.getName());
		} catch (CollectionSharingException e) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
	}
}
