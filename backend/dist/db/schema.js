// schema.ts
import { pgTable, serial, uuid, varchar, numeric, timestamp, primaryKey, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
// 1. profile (was users) — id is now UUID, no password (Supabase Auth handles it)
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey().defaultRandom(), // matches Supabase auth.users.id
    username: varchar("username", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// 2. groups
export const groups = pgTable("groups", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    createdBy: uuid("created_by").references(() => profiles.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow(),
});
// 3. group_members (composite PK)
export const groupMembers = pgTable("group_members", {
    groupId: serial("group_id")
        .notNull()
        .references(() => groups.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .notNull()
        .references(() => profiles.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.userId] }),
}));
// 4. expenses
export const expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    groupId: serial("group_id").references(() => groups.id, {
        onDelete: "cascade",
    }),
    paidBy: uuid("paid_by").references(() => profiles.id, {
        onDelete: "restrict",
    }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    description: varchar("description", { length: 1000 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// 5. splits
export const splits = pgTable("splits", {
    id: serial("id").primaryKey(),
    expenseId: serial("expense_id").references(() => expenses.id, {
        onDelete: "cascade",
    }),
    userId: uuid("user_id").references(() => profiles.id, {
        onDelete: "restrict",
    }),
    amountOwed: numeric("amount_owed", { precision: 10, scale: 2 }).notNull(),
});
// 6. settlements
export const settlements = pgTable("settlements", {
    id: serial("id").primaryKey(),
    fromUserId: uuid("from_user_id").references(() => profiles.id, {
        onDelete: "restrict",
    }),
    toUserId: uuid("to_user_id").references(() => profiles.id, {
        onDelete: "restrict",
    }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    settledAt: timestamp("settled_at").defaultNow(),
    groupId: serial("group_id").references(() => groups.id, {
        onDelete: "cascade",
    }),
});
// --- Relations (needed for db.query.*.findMany with `with:`) ---
export const profileRelations = relations(profiles, ({ many }) => ({
    groupMemberships: many(groupMembers),
    expensesPaid: many(expenses),
    splits: many(splits),
}));
export const groupsRelations = relations(groups, ({ many, one }) => ({
    members: many(groupMembers),
    expenses: many(expenses),
    creator: one(profiles, {
        fields: [groups.createdBy],
        references: [profiles.id],
    }),
}));
export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
    group: one(groups, {
        fields: [groupMembers.groupId],
        references: [groups.id],
    }),
    user: one(profiles, {
        fields: [groupMembers.userId],
        references: [profiles.id],
    }),
}));
export const expensesRelations = relations(expenses, ({ one, many }) => ({
    group: one(groups, { fields: [expenses.groupId], references: [groups.id] }),
    paidByUser: one(profiles, {
        fields: [expenses.paidBy],
        references: [profiles.id],
    }),
    splits: many(splits),
}));
export const splitsRelations = relations(splits, ({ one }) => ({
    expense: one(expenses, {
        fields: [splits.expenseId],
        references: [expenses.id],
    }),
    user: one(profiles, { fields: [splits.userId], references: [profiles.id] }),
}));
