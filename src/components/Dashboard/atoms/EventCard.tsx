import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  IconButton,
  CardOwnProps,
  Popper,
  Box,
  Button,
  Fade,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Launch as LaunchIcon,
  MoreVert as MoreVertIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { formatDate } from "@/lib/utils";
import NextLink from "next/link";

export type EventCardProps = {
  id: string;
  eventTitle: string;
  eventDate: string | Date;
  formLink: string;
  responseSheetLink: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMoreDetails?: (id: string) => void;
  sx?: CardOwnProps["sx"];
};

export default function EventCard({
  id,
  eventDate,
  eventTitle,
  responseSheetLink,
  onDelete,
  onEdit,
  sx,
}: EventCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? "simple-popper" : undefined;

  return (
    <Card
      sx={{
        minWidth: "10rem",
        minHeight: "10rem",
        position: "relative",
        ...sx,
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {formatDate(eventDate)}
        </Typography>
        <Typography variant="h5" component="div">
          <NextLink
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            href={`/admin/events/${id}`}
          >
            {eventTitle}
          </NextLink>
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          width: "100%",
          flexDirection: "row-reverse",
          position: "absolute",
          right: "0",
          bottom: "0",
          background: "linear-gradient(#1e1e1e 0%, #121212 100%)",
        }}
      >
        <IconButton
          size="small"
          aria-describedby={id}
          type="button"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Popper
          id={popperId}
          open={open}
          anchorEl={anchorEl}
          placement="right-start"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  padding: "0.25rem 0",
                  gap: "0.25rem",
                  "& > .MuiButton-root": {
                    padding: "0.75rem 1.5rem",
                  },
                }}
              >
                <Button
                  size="small"
                  onClick={() => onEdit && onEdit(id)}
                  color={"info"}
                  endIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => onDelete && onDelete(id)}
                  color={"error"}
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </Fade>
          )}
        </Popper>
        <NextLink
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
          href={`/admin/events/${id}`}
        >
          <IconButton size="small">
            <LaunchIcon />
          </IconButton>
        </NextLink>
        <NextLink href={responseSheetLink} target="_blank">
          <IconButton size="small">
            <DescriptionIcon />
          </IconButton>
        </NextLink>
      </CardActions>
    </Card>
  );
}
