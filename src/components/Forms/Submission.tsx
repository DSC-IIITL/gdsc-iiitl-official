"use client";

import {
  Autocomplete,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormMode } from ".";
import { LoadingButton } from "@mui/lab";
import { GetSubmissionsType } from "@/lib/submissions";

type SubmissionType = GetSubmissionsType[number];
export type SubmissionFormType = Pick<
  SubmissionType,
  "title" | "abstract" | "relatedLinks"
>;

type SubmissionCreateProps = {
  mode: "create";
  onCreate: (data: SubmissionFormType) => Promise<void>;
  close: () => void;
  closeOnSubmit?: boolean;
};

type SubmissionEditProps = Omit<SubmissionCreateProps, "mode" | "onCreate"> & {
  mode: "edit";
  eventId: SubmissionType["eventId"];
  submissionData: SubmissionType;
  onEdit?: (
    eventId: SubmissionType["eventId"],
    data: SubmissionFormType
  ) => Promise<void>;
  onDelete?: (eventId: SubmissionType["eventId"]) => Promise<void>;
};

type SubmissionViewProps = Omit<
  SubmissionEditProps,
  "mode" | "onEdit" | "onDelete"
> & {
  mode: "view";
};

export type SubmissionFormProps =
  | SubmissionEditProps
  | SubmissionCreateProps
  | SubmissionViewProps;

export default function Submission({
  closeOnSubmit = false,
  ...props
}: SubmissionFormProps) {
  const isCreateMode = props.mode === "create";
  const isViewMode = props.mode === "view";

  const { register, handleSubmit, setValue } = useForm<SubmissionFormType>({
    defaultValues: isCreateMode
      ? { relatedLinks: [] }
      : {
          abstract: props.submissionData.abstract,
          title: props.submissionData.title,
          relatedLinks: props.submissionData.relatedLinks,
        },
  });

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FormMode>("view");

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  if (isViewMode) {
    return <SubmissionViewForm {...props} />;
  }

  const isReadOnly = !isCreateMode && mode === "view";

  const onSubmit = isCreateMode
    ? async (data: Omit<Parameters<typeof props.onCreate>[0], "eventId">) => {
        setLoading(true);
        await props.onCreate(data);
        setLoading(false);
        setMode("view");
        if (closeOnSubmit) {
          props.close();
        }
      }
    : async (
        data: Omit<
          Parameters<Exclude<typeof props.onEdit, undefined>>[1],
          "eventId"
        >
      ) => {
        setLoading(true);
        props.onEdit && (await props.onEdit(props.eventId, data));
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
                  value={props.submissionData.id}
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
              {...register("title")}
            />
          </Stack>
          <TextField
            InputProps={{
              readOnly: isReadOnly,
            }}
            label="Description"
            multiline
            maxRows={5}
            {...register("abstract")}
          />
          <Autocomplete
            multiple
            id="related-links"
            freeSolo
            defaultValue={
              props.mode === "create" ? [] : props.submissionData.relatedLinks
            }
            options={[] as readonly string[]}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant={isReadOnly ? "filled" : "standard"}
                label="Related Links"
                placeholder="https://..."
              />
            )}
            onChange={(e, value) => {
              setValue("relatedLinks", value);
            }}
            readOnly={isReadOnly}
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
                Submit
              </LoadingButton>
            ) : (
              <>
                {props.onEdit && (
                  <>
                    {isReadOnly ? (
                      <Button color="warning" onClick={() => setMode("edit")}>
                        Edit Submission
                      </Button>
                    ) : (
                      <LoadingButton
                        color="success"
                        type="submit"
                        loading={loading}
                      >
                        Save Submission
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
                          {"Delete Submission?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete your submission?
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
                                (await props.onDelete(props.eventId));
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

const SubmissionViewForm = (props: SubmissionViewProps) => {
  return (
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
          label="Id"
          variant="filled"
          defaultValue={props.submissionData.id}
        />
        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Name"
          variant={"filled"}
          required
          defaultValue={props.submissionData.title}
        />
      </Stack>
      <TextField
        InputProps={{
          readOnly: true,
        }}
        label="Description"
        multiline
        maxRows={5}
        defaultValue={props.submissionData.abstract}
      />
      <Autocomplete
        multiple
        id="related-links"
        freeSolo
        options={[] as readonly string[]}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Related Links"
            placeholder="https://..."
          />
        )}
        defaultValue={props.submissionData.relatedLinks}
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
  );
};
