CREATE DATABASE zero_code;

CREATE TABLE "account"(
    id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp without time zone,
    refresh_token_expires_at timestamp without time zone,
    scope text,
    password text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    deleted_at timestamp without time zone,
    PRIMARY KEY(id),
    CONSTRAINT account_user_id_user_id_fk FOREIGN key(user_id) REFERENCES "user"(id)
);