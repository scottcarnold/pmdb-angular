package xandercat.pmdba.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
	
	@RequestMapping("/test")
	public Map<String,Object> test() {
		Map<String,Object> model = new HashMap<String,Object>();
		model.put("id","abc");
		return model;
	}
}
