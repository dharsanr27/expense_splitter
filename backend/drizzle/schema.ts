import { pgTable, foreignKey, uuid, varchar, timestamp, pgPolicy, serial, integer, numeric, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
]);

export const groups = pgTable("groups", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [profiles.id],
			name: "groups_created_by_fkey"
		}).onDelete("set null"),
	pgPolicy("Members can view their groups", { as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM group_members gm
  WHERE ((gm.group_id = groups.id) AND (gm.user_id = auth.uid()))))` }),
]);

export const expenses = pgTable("expenses", {
	id: serial().primaryKey().notNull(),
	groupId: integer("group_id"),
	paidBy: uuid("paid_by"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	description: varchar({ length: 1000 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "expenses_group_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.paidBy],
			foreignColumns: [profiles.id],
			name: "expenses_paid_by_fkey"
		}).onDelete("restrict"),
]);

export const splits = pgTable("splits", {
	id: serial().primaryKey().notNull(),
	expenseId: integer("expense_id"),
	userId: uuid("user_id"),
	amountOwed: numeric("amount_owed", { precision: 10, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.expenseId],
			foreignColumns: [expenses.id],
			name: "splits_expense_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "splits_user_id_fkey"
		}).onDelete("restrict"),
]);

export const settlements = pgTable("settlements", {
	id: serial().primaryKey().notNull(),
	fromUserId: uuid("from_user_id"),
	toUserId: uuid("to_user_id"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	settledAt: timestamp("settled_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	groupId: integer("group_id"),
}, (table) => [
	foreignKey({
			columns: [table.fromUserId],
			foreignColumns: [profiles.id],
			name: "settlements_from_user_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "settlements_group_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.toUserId],
			foreignColumns: [profiles.id],
			name: "settlements_to_user_id_fkey"
		}).onDelete("restrict"),
]);

export const groupMembers = pgTable("group_members", {
	groupId: integer("group_id").notNull(),
	userId: uuid("user_id").notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "group_members_group_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "group_members_user_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.groupId, table.userId], name: "group_members_pkey"}),
	pgPolicy("Members can view group members", { as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM group_members gm
  WHERE ((gm.group_id = group_members.group_id) AND (gm.user_id = auth.uid()))))` }),
]);
