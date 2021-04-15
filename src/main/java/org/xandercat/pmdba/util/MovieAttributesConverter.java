package org.xandercat.pmdba.util;

import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;

/**
 * Converter to convert movie attribute key names between PMDB format and AWS format.
 * 
 * @author Scott Arnold
 */
public class MovieAttributesConverter implements DynamoDBTypeConverter<Map<String, String>, Map<String, String>> {

	@Override
	public Map<String, String> convert(Map<String, String> object) {
		return object.entrySet().stream()
				.collect(Collectors.toMap(entry -> FormatUtil.convertToDynamoKey(entry.getKey()), Entry::getValue));
	}

	@Override
	public Map<String, String> unconvert(Map<String, String> object) {
		return object.entrySet().stream()
				.collect(Collectors.toMap(entry -> FormatUtil.convertFromDynamoKey(entry.getKey()), Entry::getValue));
	}
}
