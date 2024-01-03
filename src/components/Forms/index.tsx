import EventForm from "./Event";

export type FormMode = "view" | "edit" | "create";

const Forms = {
  Event: EventForm,
};

export default Forms;
