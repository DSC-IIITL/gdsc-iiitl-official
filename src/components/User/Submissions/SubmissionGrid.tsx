import { Typography } from "@mui/material";
import SubmissionCard from "./SubmissionCard";
import { GetSubmissionsType } from "@/lib/submissions";

export type SubmissionGridProps = {
  submissions: GetSubmissionsType;
};

export default function SubmissionGrid(props: SubmissionGridProps) {
  return props.submissions.length > 0 ? (
    props.submissions.map((submission) => (
      <SubmissionCard key={submission.id} {...submission} />
    ))
  ) : (
    <Typography variant="h6">
      You have not submitted to any events yet. Please submit an abstract to
      view it here.
    </Typography>
  );
}
