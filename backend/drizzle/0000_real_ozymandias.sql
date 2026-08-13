-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer,
	"paid_by" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "splits" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_id" integer,
	"user_id" uuid,
	"amount_owed" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_user_id" uuid,
	"to_user_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"settled_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"group_id" integer
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "group_members_pkey" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "group_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "splits" ADD CONSTRAINT "splits_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "splits" ADD CONSTRAINT "splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Members can view their groups" ON "groups" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM group_members gm
  WHERE ((gm.group_id = groups.id) AND (gm.user_id = auth.uid())))));--> statement-breakpoint
CREATE POLICY "Members can view group members" ON "group_members" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM group_members gm
  WHERE ((gm.group_id = group_members.group_id) AND (gm.user_id = auth.uid())))));
*/