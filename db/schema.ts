import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const keys = pgTable("keys", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // daily, weekly, monthly
  keyValue: text("key_value").notNull(),
  usesRemaining: integer("uses_remaining").notNull().default(3),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
