import Forms from "@/components/Forms";
import { SubmissionsContext } from "@/contexts/SubmissionsContext";
import { GetSubmissionsType } from "@/lib/submissions";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useContext, useState } from "react";

type SubmissionCardProps = GetSubmissionsType[number];

export default function SubmissionCard(props: SubmissionCardProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { deleteSubmission, updateSubmission } = useContext(SubmissionsContext);

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.event.name}
          </Typography>
          <Typography variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {dayjs(props.submissionTime).format("ddd, DD MMM, YYYY")}
          </Typography>
          <Typography variant="body2">{props.abstract}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setOpen(true)}>
            More
          </Button>
        </CardActions>
      </Card>
      <Dialog
        onClose={handleClose}
        open={open}
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
          <DialogTitle>{props.title}</DialogTitle>
          <Forms.Submission
            close={() => handleClose()}
            submissionData={{ ...props }}
            mode="edit"
            eventId={props.eventId}
            onEdit={(id, data) => updateSubmission(id, data)}
            onDelete={(id) => deleteSubmission(id)}
          />
        </Stack>
      </Dialog>
    </>
  );
}
