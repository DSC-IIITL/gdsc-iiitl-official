import { SubmissionFormType } from "@/components/Forms/Submission";
import { GetSubmissionsType } from "@/lib/submissions";
import { createContext } from "react";

type SubmissionType = GetSubmissionsType[number];

export const SubmissionsContext = createContext<{
  deleteSubmission: (eventId: SubmissionType["eventId"]) => Promise<void>;
  updateSubmission: (
    eventId: SubmissionType["eventId"],
    data: SubmissionFormType
  ) => Promise<void>;
  createSubmission: (
    eventId: SubmissionType["eventId"],
    data: SubmissionFormType
  ) => Promise<void>;
  refresh: () => Promise<void>;
}>({
  deleteSubmission: async () => {},
  updateSubmission: async () => {},
  createSubmission: async () => {},
  refresh: async () => {},
});
