import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export type EventCardProps = Prisma.EventGetPayload<Record<string, never>>;

export default function EventCard(props: EventCardProps) {
  const router = useRouter();

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
          <Button
            size="small"
            onClick={() => router.push("/user/submissions?new=true")}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
