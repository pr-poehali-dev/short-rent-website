CREATE TABLE IF NOT EXISTS apartments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL DEFAULT 'Ачинск',
  price INTEGER NOT NULL,
  rooms VARCHAR(50),
  area INTEGER,
  floor VARCHAR(50),
  description TEXT,
  tags TEXT[],
  img_url VARCHAR(500),
  badge VARCHAR(50),
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
