"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  Fab,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import SubmissionGrid from "./SubmissionGrid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "@/lib/utils";
import { GetSubmissionsType } from "@/lib/submissions";
import AddIcon from "@mui/icons-material/Add";
import { getAxios } from "@/lib/axios.config";
import toast, { Toaster } from "react-hot-toast";
import { SubmissionsContext } from "@/contexts/SubmissionsContext";
import { SubmissionFormType } from "@/components/Forms/Submission";
import Forms from "@/components/Forms";
import SubmissionsAutoComplete from "./SubmissionsAutoComplete";

export type SubmissionsPageProps = {
  limit: number;
  page: number;
  order: Prisma.SortOrder;
  newSubmissionEvent?: Prisma.EventGetPayload<Record<string, never>>;
};

export default function UserSubmissionsPage(props: SubmissionsPageProps) {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<GetSubmissionsType>([]);
  const [newSubmissionOpen, setNewSubmissionOpen] = useState(
    !!props.newSubmissionEvent
  );

  const newSubmissionEvent =
    useRef<Prisma.EventGetPayload<Record<string, never>>>();

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleCreate = async (
    eventId: GetSubmissionsType[number]["eventId"],
    data: SubmissionFormType
  ) => {
    try {
      console.log({ data });
      const res = await getAxios().post(`/events/${eventId}/register`, data);

      const createdSubmission = res.data.data;
      console.log({ createdSubmission });

      // Set the submissions to the updated submissions
      setSubmissions((submissions) => [...submissions, createdSubmission]);

      toast.success("Created submission successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create submission");
    }
  };

  const handleUpdate = async (
    eventId: GetSubmissionsType[number]["eventId"],
    data: SubmissionFormType
  ) => {
    try {
      const res = await getAxios().put(`/events/${eventId}/register`, data);
      const updatedSubmission = res.data.data;
      console.log({ updatedSubmission });
      toast.success("Updated submission successfully");
      // Set the submissions to the updated events
      setSubmissions((submissions) =>
        submissions.map((submission) => {
          if (submission.eventId === eventId) {
            return updatedSubmission;
          }
          return submission;
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update submission");
    }
  };

  const handleDelete = async (
    eventId: GetSubmissionsType[number]["eventId"]
  ) => {
    try {
      const res = await getAxios().delete(`/events/${eventId}/register`);
      const deletedSubmission = res.data.data;
      console.log({ deletedSubmission });
      toast.success("Deleted submission successfully");
      // Set the submissions to the updated submissions
      setSubmissions((submissions) =>
        submissions.filter((submission) => submission.eventId !== eventId)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete submission");
    }
  };

  useEffect(() => {
    // Fetch the submissions from the API
    setLoading(true);
    fetch(
      `/api/submissions?limit=${props.limit}&skip=${
        (props.page - 1) * props.limit
      }&ord=${props.order}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        setSubmissions(data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.limit, props.order, props.page]);

  return (
    <>
      <Toaster position="top-center" />
      <SubmissionsContext.Provider
        value={{
          deleteSubmission: handleDelete,
          updateSubmission: handleUpdate,
          createSubmission: handleCreate,
          refresh: async () => {
            router.push(
              pathName +
                "?" +
                createQueryString(searchParams, {
                  page: props.page.toString(),
                })
            );
          },
        }}
      >
        {loading ? (
          <SunmissionsGridSkeleton />
        ) : (
          <Stack gap={"2rem"}>
            <SubmissionGrid submissions={submissions} />
            <ButtonGroup variant="outlined" aria-label="Pagination Buttons">
              <Button
                disabled={props.page <= 1}
                onClick={() =>
                  router.push(
                    pathName +
                      "?" +
                      createQueryString(searchParams, {
                        page: (props.page - 1).toString(),
                      })
                  )
                }
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    pathName +
                      "?" +
                      createQueryString(searchParams, {
                        page: (props.page + 1).toString(),
                      })
                  )
                }
                disabled={submissions.length < props.limit}
              >
                Next
              </Button>
            </ButtonGroup>
          </Stack>
        )}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: "2rem",
            right: "clamp(2rem, 5vw, 5rem)",
          }}
          onClick={() =>
            setNewSubmissionOpen((newSubmissionOpen) => !newSubmissionOpen)
          }
        >
          <AddIcon />
        </Fab>
        <Dialog
          onClose={() => setNewSubmissionOpen(false)}
          open={newSubmissionOpen}
          sx={{
            h2: {
              padding: "0",
            },
            ".MuiPaper-root": {
              padding: "16px 24px",
            },
          }}
        >
          <Stack gap={"24px"}>
            <DialogTitle>Create Submission</DialogTitle>
            {/* TODO: Add a fab option to create a submission */}
            <SubmissionsAutoComplete
              onChange={(val) => (newSubmissionEvent.current = val)}
              defaultEvent={props.newSubmissionEvent}
              options={props.newSubmissionEvent && [props.newSubmissionEvent]}
            />
            <Forms.Submission
              mode="create"
              close={() => setNewSubmissionOpen(false)}
              onCreate={async (data) =>
                newSubmissionEvent.current &&
                (await handleCreate(newSubmissionEvent.current.id, data))
              }
              closeOnSubmit
            />
          </Stack>
        </Dialog>
      </SubmissionsContext.Provider>
    </>
  );
}

export function SunmissionsGridSkeleton({
  cols = 3,
  rows = 3,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, id) => (
        <Grid container wrap="nowrap" key={id}>
          {Array.from(new Array(cols)).map((_, index) => (
            <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
              <Skeleton variant="rectangular" width={210} height={118} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton animation={"wave"} />
                <Skeleton width="60%" />
              </Box>
            </Box>
          ))}
        </Grid>
      ))}
    </>
  );
}
