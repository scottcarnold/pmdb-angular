package org.xandercat.pmdba.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.SystemPropertyUtils;

@Configuration
public class AppConfig {
	
	/**
	 * Bean that defines where properties are to be loaded from.
	 * 
	 * @return resource for properties
	 */
	@Bean
	public static Resource propertiesResource() {
		//String propertiesLocation = SystemPropertyUtils.resolvePlaceholders("${pmdb.properties.location}pmdba_${pmdb.environment}.properties");
		// TODO: Tried about a million things, but still can't get tests step to pick up these two properties
		String propertiesLocation = "C:\\Users\\Scott\\pmdb\\pmdba_dev.properties";
		return new FileSystemResource(propertiesLocation);
	}
	
	/**
	 * Bean utilized to fill property placeholders throughout the application.
	 * 
	 * @param propertiesResource resource for properties
	 * 
	 * @return bean for property placeholders
	 */
	@Bean
	public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer(Resource propertiesResource) {
		PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
		propertySourcesPlaceholderConfigurer.setLocation(propertiesResource);
		return propertySourcesPlaceholderConfigurer;
	}
}
