CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    isbn TEXT UNIQUE,
    genre VARCHAR(100),
    language VARCHAR(50),
    description TEXT,
    copies INT DEFAULT 1 CHECK (copies >= 0)
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    devolution_date TIMESTAMP DEFAULT NULL,
    returned BOOLEAN DEFAULT false,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id)
);