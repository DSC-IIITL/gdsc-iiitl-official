import EventForm from "./Event";
import SubmissionForm from "./Submission";

export type FormMode = "view" | "edit" | "create";

const Forms = {
  Event: EventForm,
  Submission: SubmissionForm,
};

export default Forms;
