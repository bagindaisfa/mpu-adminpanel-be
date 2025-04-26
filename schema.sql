-- Drop existing tables if any (biar clean waktu setup awal)
DROP TABLE IF EXISTS blog_comments;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS assessment_answers;
DROP TABLE IF EXISTS assessment_questions;
DROP TABLE IF EXISTS users;

-- Table: users (untuk admin panel)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: blogs
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_path VARCHAR(255) NOT NULL, -- path file gambar yang diupload
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: blog_comments
CREATE TABLE blog_comments (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: assessment_questions
CREATE TABLE assessment_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: assessment_answers
CREATE TABLE assessment_answers (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100),   -- hanya diisi kalau hasilnya dominan "iya"
    user_email VARCHAR(150),
    user_phone VARCHAR(20),
    answers JSONB NOT NULL,   -- format: { "1": "yes", "2": "no", ... }
    created_at TIMESTAMP DEFAULT NOW()
);
