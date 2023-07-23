USE tradespotify;
CREATE TABLE IF NOT EXISTS USER (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    spotify_id VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS API_USER (
    id_api_u INT PRIMARY KEY AUTO_INCREMENT,
    fk_id_user_api INT,
    access_token VARCHAR(255),
    refreshtoken VARCHAR(255),
    expries_at INT,
    scope VARCHAR(255),
    FOREIGN KEY (fk_id_user_api) REFERENCES user(id_user)
);


CREATE TABLE IF NOT EXISTS SPOTIFY_DATA (
    id_spotify_data INT PRIMARY KEY AUTO_INCREMENT,
    fk_id_user_data INT,
    FOREIGN KEY (fk_id_user_data) REFERENCES user(id_user)
)
