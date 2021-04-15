package org.xandercat.pmdba.util;

import java.util.Comparator;

import org.xandercat.pmdba.dto.Movie;

/**
 * Comparator for comparing movies by movie title.  Comparison is case insensitive.
 * 
 * @author Scott Arnold
 */
public class MovieTitleComparator implements Comparator<Movie> {

	@Override
	public int compare(Movie o1, Movie o2) {
		if (o1 == null || o1.getTitle() == null) {
			return -1;
		}
		if (o2 == null || o2.getTitle() == null) {
			return 1;
		}
		return o1.getTitle().toLowerCase().compareTo(o2.getTitle().toLowerCase());
	}
}
