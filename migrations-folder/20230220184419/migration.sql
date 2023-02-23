CREATE TABLE IF NOT EXISTS "pdc_albums" (
	"album_id" text NOT NULL,
	"client_id" text NOT NULL,
	"is_unlocked" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "pdc_selfies" (
	"selfie_id" text PRIMARY KEY NOT NULL,
	"selfie_url" text NOT NULL,
	"selfie_thumbnail" text NOT NULL,
	"shift_x" real,
	"shift_y" real,
	"zoom" real,
	"width" real,
	"height" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "pdc_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_in" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "pdc_client" (
	"client_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"phone" text NOT NULL,
	"selfie_id" text,
	"email" text,
	"full_name" text
);

DO $$ BEGIN
 ALTER TABLE pdc_albums ADD CONSTRAINT pdc_albums_client_id_pdc_client_client_id_fk FOREIGN KEY ("client_id") REFERENCES pdc_client("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pdc_sessions ADD CONSTRAINT pdc_sessions_client_id_pdc_client_client_id_fk FOREIGN KEY ("client_id") REFERENCES pdc_client("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pdc_client ADD CONSTRAINT pdc_client_selfie_id_pdc_selfies_selfie_id_fk FOREIGN KEY ("selfie_id") REFERENCES pdc_selfies("selfie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
