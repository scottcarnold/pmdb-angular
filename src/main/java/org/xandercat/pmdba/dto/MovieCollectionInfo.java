package org.xandercat.pmdba.dto;

/**
 * Wrapper for MovieCollection that also contains user-specific metadata.
 * 
 * @author Scott Arnold
 */
public class MovieCollectionInfo {

	private MovieCollection movieCollection;
	private boolean editable;
	private boolean owned;
	
	public MovieCollection getMovieCollection() {
		return movieCollection;
	}
	public void setMovieCollection(MovieCollection movieCollection) {
		this.movieCollection = movieCollection;
	}
	public boolean isEditable() {
		return editable;
	}
	public void setEditable(boolean editable) {
		this.editable = editable;
	}
	public boolean isOwned() {
		return owned;
	}
	public void setOwned(boolean owned) {
		this.owned = owned;
	} 
}
