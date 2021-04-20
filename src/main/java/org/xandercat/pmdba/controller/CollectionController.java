package org.xandercat.pmdba.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xandercat.pmdba.dto.MovieCollectionInfo;
import org.xandercat.pmdba.service.CollectionService;

@RestController
public class CollectionController {

	@Autowired
	private CollectionService collectionService;
	
	@RequestMapping("/services/collections/default")
	public MovieCollectionInfo defaultCollection(Principal principal) {
		Optional<MovieCollectionInfo> movieCollectionInfo = collectionService.getDefaultMovieCollection(principal.getName());
		return movieCollectionInfo.isPresent()? movieCollectionInfo.get() : null;
	}
	
	@RequestMapping("/services/collections/viewable")
	public List<MovieCollectionInfo> viewableCollections(Principal principal) {
		return collectionService.getViewableMovieCollections(principal.getName());
	}
}
