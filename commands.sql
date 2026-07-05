# Exercise 2

# creates blogs table with specified columns
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer NOT NULL DEFAULT 0
);

# inserts two rows in the blogs table
INSERT INTO blogs (author, url, title, likes)
VALUES
('Jane', 'www.website.com', 'Using SQL queries', 7),
('John', 'www.example.com', 'Basics of postgres', 5);
