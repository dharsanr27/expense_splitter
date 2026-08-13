import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, groups, expenses, splits, settlements, groupMembers } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	groups: many(groups),
	expenses: many(expenses),
	splits: many(splits),
	settlements_fromUserId: many(settlements, {
		relationName: "settlements_fromUserId_profiles_id"
	}),
	settlements_toUserId: many(settlements, {
		relationName: "settlements_toUserId_profiles_id"
	}),
	groupMembers: many(groupMembers),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const groupsRelations = relations(groups, ({one, many}) => ({
	profile: one(profiles, {
		fields: [groups.createdBy],
		references: [profiles.id]
	}),
	expenses: many(expenses),
	settlements: many(settlements),
	groupMembers: many(groupMembers),
}));

export const expensesRelations = relations(expenses, ({one, many}) => ({
	group: one(groups, {
		fields: [expenses.groupId],
		references: [groups.id]
	}),
	profile: one(profiles, {
		fields: [expenses.paidBy],
		references: [profiles.id]
	}),
	splits: many(splits),
}));

export const splitsRelations = relations(splits, ({one}) => ({
	expense: one(expenses, {
		fields: [splits.expenseId],
		references: [expenses.id]
	}),
	profile: one(profiles, {
		fields: [splits.userId],
		references: [profiles.id]
	}),
}));

export const settlementsRelations = relations(settlements, ({one}) => ({
	profile_fromUserId: one(profiles, {
		fields: [settlements.fromUserId],
		references: [profiles.id],
		relationName: "settlements_fromUserId_profiles_id"
	}),
	group: one(groups, {
		fields: [settlements.groupId],
		references: [groups.id]
	}),
	profile_toUserId: one(profiles, {
		fields: [settlements.toUserId],
		references: [profiles.id],
		relationName: "settlements_toUserId_profiles_id"
	}),
}));

export const groupMembersRelations = relations(groupMembers, ({one}) => ({
	group: one(groups, {
		fields: [groupMembers.groupId],
		references: [groups.id]
	}),
	profile: one(profiles, {
		fields: [groupMembers.userId],
		references: [profiles.id]
	}),
}));