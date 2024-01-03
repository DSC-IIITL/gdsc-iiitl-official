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

type EventType = Prisma.EventGetPayload<Record<string, never>>;

export type EventCreateProps = {
  mode: "create";
  onCreate: (data: Omit<EventType, "id">) => Promise<void>;
  close: () => void;
  closeOnSubmit?: boolean;
};

export type EventUpdateProps = Omit<EventCreateProps, "mode" | "onCreate"> & {
  mode: "viewedit";
  eventData: Partial<EventType> & { id: EventType["id"] };
  onEdit?: (data: EventType) => Promise<void>;
  onDelete?: (data: EventType["id"]) => Promise<void>;
};

export type EventFormProps = EventUpdateProps | EventCreateProps;

export default function EventForm({
  closeOnSubmit = false,
  ...props
}: EventFormProps) {
  const isCreateMode = props.mode === "create";

  const { register, handleSubmit, control } = useForm<EventType>({
    defaultValues: isCreateMode ? undefined : props.eventData,
  });

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FormMode>("view");

  const isReadOnly = !isCreateMode && mode === "view";

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  const onSubmit = isCreateMode
    ? async (data: EventType) => {
        setLoading(true);
        props.onCreate(data);
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
              <Button color="success" type="submit">
                Create Event
              </Button>
            ) : (
              <>
                {" "}
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
