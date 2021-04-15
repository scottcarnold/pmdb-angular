package org.xandercat.pmdba.dto;

import org.springframework.data.annotation.Id;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

/**
 * Class for representing a movie collection.
 * 
 * Annotated for storage in AWS DynamoDB.
 * 
 * @author Scott Arnold
 */
@DynamoDBTable(tableName="MovieCollection")
public class MovieCollection {

	@Id
	@DynamoDBHashKey
	private String id;
	@DynamoDBAttribute
	private String name;
	@DynamoDBAttribute
	private String owner;
	@DynamoDBAttribute
	private boolean cloud;
	@DynamoDBAttribute
	private boolean publicView;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public boolean isCloud() {
		return cloud;
	}
	public void setCloud(boolean cloud) {
		this.cloud = cloud;
	}
	public boolean isPublicView() {
		return publicView;
	}
	public void setPublicView(boolean publicView) {
		this.publicView = publicView;
	}
}
