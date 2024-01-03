import { Prisma } from "@prisma/client";
import { createContext } from "react";

export const EventsContext = createContext<{
  deleteEvent: (
    id: Prisma.EventGetPayload<Record<string, never>>["id"]
  ) => Promise<void>;
  updateEvent: (
    id: Prisma.EventGetPayload<Record<string, never>>["id"],
    data: Partial<Prisma.EventGetPayload<Record<string, never>>>
  ) => Promise<void>;
  createEvent: (
    data: Prisma.EventGetPayload<Record<string, never>>
  ) => Promise<void>;
  refresh: () => Promise<void>;
}>({
  deleteEvent: async () => {},
  updateEvent: async () => {},
  createEvent: async () => {},
  refresh: async () => {},
});
