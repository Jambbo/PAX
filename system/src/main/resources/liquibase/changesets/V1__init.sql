CREATE TABLE IF NOT EXISTS users
(
    id                  BIGSERIAL PRIMARY KEY,
    username            VARCHAR(50)  NOT NULL UNIQUE,
    email               VARCHAR(255) UNIQUE,
    password            VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100),
    last_name           VARCHAR(100),
    bio                 TEXT,
    profile_picture_url VARCHAR(500),
    status              VARCHAR(50),
    phone_number        VARCHAR(30),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_profile_private  BOOLEAN   DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS groups
(
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  VARCHAR(500),
    privacy      VARCHAR(50),
    avatar_image VARCHAR(500),
    cover_image  VARCHAR(500),
    location     VARCHAR(255),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id     BIGINT,
    rules        VARCHAR(1000),
    member_count INT       DEFAULT 0,
    post_count   INT       DEFAULT 0,
    CONSTRAINT fk_groups_users FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts
(
    id         BIGSERIAL PRIMARY KEY,
    text       VARCHAR(2000),
    views      BIGINT    DEFAULT 0,
    likes      BIGINT    DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id  BIGINT,
    group_id   BIGINT,
    CONSTRAINT fk_posts_users FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_posts_groups FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
);


-- element collection
CREATE TABLE IF NOT EXISTS posts_images
(
    post_id BIGINT       NOT NULL,
    image   VARCHAR(500) NOT NULL,
    PRIMARY KEY (post_id, image),
    CONSTRAINT fk_posts_images_posts FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE NO ACTION
);


--manytomany
CREATE TABLE IF NOT EXISTS group_members
(
    group_id BIGINT NOT NULL,
    user_id  BIGINT NOT NULL,
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group_members_groups FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

--manytomany
CREATE TABLE IF NOT EXISTS group_admins
(
    group_id BIGINT NOT NULL,
    user_id  BIGINT NOT NULL,
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group_members_groups FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

--manytomany
CREATE TABLE IF NOT EXISTS user_friends
(
    user_id   BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    friend_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, friend_id),
    CONSTRAINT user_not_self CHECK (user_id <> friend_id)
);

CREATE TABLE IF NOT EXISTS users_roles
(
    user_id BIGINT       NOT NULL,
    role    VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, role),
    CONSTRAINT fk_users_roles_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);