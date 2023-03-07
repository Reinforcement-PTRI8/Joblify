CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100),
    occupation VARCHAR(30),
    access_token VARCHAR(1000),
    refresh_token VARCHAR(1000)
);

CREATE TYPE stage AS ENUM ('Applied', 'Phone Screen', 'Technical Interviews', 'System Design Interview', 'Offer');

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    job_url VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    company_name VARCHAR(30) NOT NULL,
    interview_stage stage,
    last_interaction VARCHAR(30) 
);

CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users (id),
    s3_filename VARCHAR(500) NOT NULL,
    s3_url VARCHAR(500) NOT NULL,
    last_modified DATE
);

CREATE TABLE cover_letters (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users (id),
    s3_filename VARCHAR(500) NOT NULL,
    s3_url VARCHAR(500) NOT NULL,
    last_modified DATE
);

