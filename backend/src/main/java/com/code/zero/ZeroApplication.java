package com.code.zero;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.code.zero.mapper")
public class ZeroApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZeroApplication.class, args);
	}

}
