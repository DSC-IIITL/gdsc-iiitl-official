import Forms from "@/components/Forms";
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
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { EventsContext } from "./Page";

export type EventCardProps = Prisma.EventGetPayload<Record<string, never>>;

export default function EventCard(props: EventCardProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { deleteEvent, updateEvent } = useContext(EventsContext);

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.venue}
          </Typography>
          <Typography variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {dayjs(props.startDate).format("ddd, DD MMM, YYYY")} -{" "}
            {dayjs(props.endDate).format("ddd, DD MMM, YYYY")}
          </Typography>
          <Typography variant="body2">{props.description}</Typography>
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
          <DialogTitle>{props.name}</DialogTitle>
          <Forms.Event
            close={() => handleClose()}
            eventData={{ ...props }}
            onEdit={(data) => updateEvent(data.id, data)}
            onDelete={(id) => deleteEvent(id)}
          />
        </Stack>
      </Dialog>
    </>
  );
}
