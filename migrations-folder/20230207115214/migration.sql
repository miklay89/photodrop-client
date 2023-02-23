CREATE TABLE IF NOT EXISTS "pd_albums" (
	"album_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_photos" (
	"photo_id" text PRIMARY KEY NOT NULL,
	"unlocked_photo_url" text NOT NULL,
	"unlocked_thumbnail_url" text NOT NULL,
	"locked_photo_url" text NOT NULL,
	"locked_thumbnail_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"album_id" text NOT NULL,
	"clients" text
);

CREATE TABLE IF NOT EXISTS "pd_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_in" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_users" (
	"login" text NOT NULL,
	"password" text NOT NULL,
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"full_name" text,
	"email" text
);

DO $$ BEGIN
 ALTER TABLE pd_albums ADD CONSTRAINT pd_albums_user_id_pd_users_user_id_fk FOREIGN KEY ("user_id") REFERENCES pd_users("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_photos ADD CONSTRAINT pd_photos_album_id_pd_albums_album_id_fk FOREIGN KEY ("album_id") REFERENCES pd_albums("album_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_sessions ADD CONSTRAINT pd_sessions_user_id_pd_users_user_id_fk FOREIGN KEY ("user_id") REFERENCES pd_users("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;