package org.xandercat.pmdba.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xandercat.pmdba.dto.MovieCollection;
import org.xandercat.pmdba.dto.MovieCollectionInfo;

@RestController
public class CollectionController {

	@RequestMapping("/services/collections")
	public List<MovieCollectionInfo> collections(Principal principal) {
		// just build a mock list as a test
		List<MovieCollectionInfo> movieCollectionInfos = new ArrayList<MovieCollectionInfo>();
		MovieCollectionInfo movieCollectionInfo = new MovieCollectionInfo();
		MovieCollection movieCollection = new MovieCollection();
		movieCollection.setId("abcd");
		movieCollection.setName("My Movie List");
		movieCollection.setOwner("user");
		movieCollection.setPublicView(true);
		movieCollection.setCloud(false);
		movieCollectionInfo.setEditable(true);
		movieCollectionInfo.setOwned(true);
		movieCollectionInfo.setMovieCollection(movieCollection);
		movieCollectionInfos.add(movieCollectionInfo);
		return movieCollectionInfos;
	}
}
