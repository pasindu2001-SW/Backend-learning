CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'TODO' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
