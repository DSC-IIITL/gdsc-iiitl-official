"use client";

import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { FormInputDate } from "./DateTime";
import { useState } from "react";
import { FormMode } from ".";
import { LoadingButton } from "@mui/lab";
import {
  DateTimePicker,
  LocalizationProvider,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type EventType = Prisma.EventGetPayload<Record<string, never>>;

export type EventCreateProps = {
  mode: "create";
  onCreate: (data: Omit<EventType, "id">) => Promise<void>;
  close: () => void;
  closeOnSubmit?: boolean;
};

export type EventUpdateProps = Omit<EventCreateProps, "mode" | "onCreate"> & {
  mode: "edit";
  eventData: Partial<EventType> & { id: EventType["id"] };
  onEdit?: (data: EventType) => Promise<void>;
  onDelete?: (data: EventType["id"]) => Promise<void>;
};

export type EventViewProps = Omit<
  EventUpdateProps,
  "mode" | "onEdit" | "onDelete"
> & {
  mode: "view";
};

export type EventFormProps =
  | EventUpdateProps
  | EventCreateProps
  | EventViewProps;

export default function EventForm({
  closeOnSubmit = false,
  ...props
}: EventFormProps) {
  const isCreateMode = props.mode === "create";
  const isViewMode = props.mode === "view";

  const { register, handleSubmit, control } = useForm<EventType>({
    defaultValues: isCreateMode ? undefined : props.eventData,
  });

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FormMode>("view");

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  if (isViewMode) {
    return <EventViewForm {...props} />;
  }

  const isReadOnly = !isCreateMode && mode === "view";

  const onSubmit = isCreateMode
    ? async (data: EventType) => {
        setLoading(true);
        await props.onCreate(data);
        setLoading(false);
        setMode("view");
        if (closeOnSubmit) {
          props.close();
        }
      }
    : async (data: EventType) => {
        setLoading(true);
        props.onEdit && (await props.onEdit(data));
        setLoading(false);
        setMode("view");
        if (closeOnSubmit) {
          props.close();
        }
      };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction={"row"}
            sx={{
              "& > *": {
                flexGrow: 1,
              },
            }}
          >
            {!isCreateMode && (
              <Tooltip title="Id can't be edited">
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  label="Id"
                  variant="filled"
                  {...register("id")}
                />
              </Tooltip>
            )}
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              label="Name"
              variant={isReadOnly ? "filled" : "outlined"}
              required
              {...register("name")}
            />
          </Stack>
          <TextField
            InputProps={{
              readOnly: isReadOnly,
            }}
            label="Description"
            multiline
            maxRows={5}
            {...register("description")}
          />
          <Stack
            spacing={2}
            direction={"row"}
            sx={{
              "& > *": {
                flexGrow: 1,
              },
            }}
          >
            <FormInputDate
              control={control}
              label="Start Date"
              name="startDate"
              readOnly={isReadOnly}
            />
            <FormInputDate
              control={control}
              label="End Date"
              name="endDate"
              readOnly={isReadOnly}
            />
          </Stack>
          <TextField
            InputProps={{
              readOnly: isReadOnly,
            }}
            required
            label="Venue"
            variant={isReadOnly ? "filled" : "outlined"}
            {...register("venue")}
          />
          <ButtonGroup
            variant="text"
            aria-label="outlined button group"
            sx={{
              "& > *": {
                flexGrow: 1,
              },
            }}
          >
            {isCreateMode ? (
              <LoadingButton color="success" type="submit" loading={loading}>
                Create Event
              </LoadingButton>
            ) : (
              <>
                {props.onEdit && (
                  <>
                    {isReadOnly ? (
                      <Button color="warning" onClick={() => setMode("edit")}>
                        Edit
                      </Button>
                    ) : (
                      <LoadingButton
                        color="success"
                        type="submit"
                        loading={loading}
                      >
                        Save
                      </LoadingButton>
                    )}
                  </>
                )}
                {props.onDelete && (
                  <>
                    {props.onDelete && (
                      <Dialog
                        open={openConfirm}
                        onClose={handleConfirmClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Delete Event?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete{" "}
                            {props.eventData.name}?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleConfirmClose} autoFocus>
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              setOpenConfirm(false);
                              setLoading(true);
                              !isCreateMode &&
                                props.onDelete &&
                                (await props.onDelete(props.eventData.id));
                              setLoading(false);
                              if (closeOnSubmit) {
                                props.close();
                              }
                            }}
                            color="error"
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    )}
                    <LoadingButton
                      loading={loading}
                      color="error"
                      onClick={() => setOpenConfirm(true)}
                    >
                      Delete
                    </LoadingButton>
                  </>
                )}
              </>
            )}
          </ButtonGroup>
        </Stack>
      </form>
    </>
  );
}

const EventViewForm = (props: EventViewProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack
          spacing={2}
          direction={"row"}
          sx={{
            "& > *": {
              flexGrow: 1,
            },
          }}
        >
          <TextField
            InputProps={{
              readOnly: true,
            }}
            defaultValue={props.eventData.id}
            label="Id"
            variant="filled"
          />
          <TextField
            InputProps={{
              readOnly: true,
            }}
            defaultValue={props.eventData.name}
            label="Name"
            variant={"filled"}
            required
          />
        </Stack>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          defaultValue={props.eventData.description}
          label="Description"
          multiline
          maxRows={5}
        />
        <Stack
          spacing={2}
          direction={"row"}
          sx={{
            "& > *": {
              flexGrow: 1,
            },
          }}
        >
          <DateTimePicker
            label={"Start Date"}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            value={dayjs(props.eventData.startDate)}
            readOnly={true}
          />
          <DateTimePicker
            label={"End Date"}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            value={dayjs(props.eventData.endDate)}
            readOnly={true}
          />
        </Stack>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          defaultValue={props.eventData.venue}
          label="Venue"
          variant={"filled"}
        />
        <ButtonGroup
          variant="text"
          aria-label="outlined button group"
          sx={{
            "& > *": {
              flexGrow: 1,
            },
          }}
        >
          <Button onClick={() => props.close()}>Close</Button>
        </ButtonGroup>
      </Stack>
    </LocalizationProvider>
  );
};
