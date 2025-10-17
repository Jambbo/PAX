val versions = mapOf(
    "javaxAnnotationApiVersion" to "1.3.2",
    "javaxValidationApiVersion" to "2.0.0.Final",
    "javaxServletApiVersion" to "2.5",
    "postgresqlVersion" to "42.7.8",
    "liquibaseVersion" to "5.0.1",
    "preLiquibaseVersion" to "1.6.1"
)

plugins {
    idea
    java
    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
description = "system"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(24)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("javax.annotation:javax.annotation-api:${versions["javaxAnnotationApiVersion"]}")
    implementation("org.postgresql:postgresql:${versions["postgresqlVersion"]}")
    implementation("org.liquibase:liquibase-core:${versions["liquibaseVersion"]}")
    implementation("net.lbruun.springboot:preliquibase-spring-boot-starter:${versions["preLiquibaseVersion"]}")

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
