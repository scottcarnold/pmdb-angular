package org.xandercat.pmdba.config;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.xandercat.pmdba.dao.KeyGenerator;
import org.xandercat.pmdba.dao.RandomKeyGenerator;

/**
 * Data configuration for generic data and RDBMS services.
 *  
 * @author Scott Arnold
 */
@Configuration
public class DataConfig {

	/**
	 * Bean for generating keys for use with both local and cloud datasources.
	 * 
	 * @return bean for generating key values
	 */
	@Bean
	public KeyGenerator keyGenerator() {
		return new RandomKeyGenerator();
	}
	
	/**
	 * Create data source for querying the database.
	 * 
	 * @return data source
	 */
	@Bean
	@ConfigurationProperties(prefix="pmdb.datasource")
	public DataSource pmdbDataSource() {
		return DataSourceBuilder.create().build();
	}
	
	/**
	 * JDBC template for queries against the datasource.
	 * 
	 * @param dataSource datasource for application
	 * 
	 * @return JDBC template for datasource
	 */
	@Bean
	public JdbcTemplate jdbcTemplate(DataSource pmdbDataSource) {
		return new JdbcTemplate(pmdbDataSource);
	}
}
