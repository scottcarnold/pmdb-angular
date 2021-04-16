package org.xandercat.pmdba.config;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.session.web.http.HeaderHttpSessionIdResolver;
import org.springframework.session.web.http.HttpSessionIdResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

	// this bean really only needed for development with ng serve. TODO: See if can be inactivated with a profile for prod
	@Bean
	public HttpSessionIdResolver httpSessionIdResolver() {
		return HeaderHttpSessionIdResolver.xAuthToken();
	}
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		System.out.println("Adding CORS Mappings...");
		// TODO: this provides support for ng serve in development, but should probably be disabled for production
		registry.addMapping("/**").allowedOrigins("http://localhost:4200")
			//.allowedHeaders("devsessionid")
			.exposedHeaders("devsessionid");
	}

	/**
	 * Configure Spring to route anything that might be an Angular router path back to Angular.
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**")
			.addResourceLocations("classpath:/static/")
			.resourceChain(true)
			.addResolver(new PathResourceResolver() {
				protected Resource getResource(String resourcePath, Resource location) throws IOException {
					Resource requestedResource = location.createRelative(resourcePath);
					return requestedResource.exists() && requestedResource.isReadable() 
							? requestedResource
							: new ClassPathResource("/static/index.html");
				}
			});
	}

}
