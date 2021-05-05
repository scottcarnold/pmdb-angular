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
	
	@GetMapping("/default")
	public MovieCollectionInfo defaultCollection(Principal principal) {
		Optional<MovieCollectionInfo> movieCollectionInfo = collectionService.getDefaultMovieCollection(principal.getName());
		return movieCollectionInfo.isPresent()? movieCollectionInfo.get() : null;
	}
	
	@GetMapping("/viewable")
	public List<MovieCollectionInfo> viewableCollections(Principal principal) {
		return collectionService.getViewableMovieCollections(principal.getName());
	}
	
	@GetMapping("/shareOffers")
	public List<MovieCollectionInfo> shareOfferCollections(Principal principal) {
		return collectionService.getShareOfferMovieCollections(principal.getName());
	}
	
	@PostMapping("/changeDefault")
	public MovieCollectionInfo changeDefaultCollection(@RequestBody String collectionId, Principal principal) {
		try {
			collectionService.setDefaultMovieCollection(collectionId, principal.getName());
			Optional<MovieCollectionInfo> defaultCollection = collectionService.getDefaultMovieCollection(principal.getName());
			return defaultCollection.isPresent()? defaultCollection.get() : null;
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to change default collection.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
	}
	
	@PostMapping("/new")
	public MovieCollection newCollection(@RequestBody MovieCollection movieCollection, Principal principal) {
		try {
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
			LOGGER.error("Unable to delete movie collection.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		} catch (WebServicesException e) {
			LOGGER.error("Unable to delete movie collection.", e);
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
		}
	}
	
	@PostMapping("/acceptShareOffer")
	public void acceptShareOffer(@RequestBody String movieCollectionId, Principal principal) {
		try {
			collectionService.acceptShareOffer(movieCollectionId, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to accept share offer.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
	}
	
	@PostMapping("/declineShareOffer")
	public void declineShareOffer(@RequestBody String movieCollectionId, Principal principal) {
		try {
			collectionService.declineShareOffer(movieCollectionId, principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to decline share offer.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
	}
	
	@PostMapping("/revokeMyPermission")
	public void revokeMyPermission(@RequestBody String movieCollectionId, Principal principal) {
		try {
			collectionService.unshareMovieCollection(movieCollectionId, principal.getName(), principal.getName());
		} catch (CollectionSharingException e) {
			LOGGER.error("Unable to revoke users own permission to a movie collection.", e);
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
	}
}
