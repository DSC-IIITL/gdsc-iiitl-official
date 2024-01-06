import { getAxios } from "@/lib/axios.config";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

type EventResult = Prisma.EventGetPayload<Record<string, never>>;

type SubmissionsAutoCompleteProps = {
  searchTimeout?: number;
  onChange: (event: EventResult) => void;
  defaultEvent?: EventResult;
  options?: EventResult[];
};

export default function SubmissionsAutoComplete({
  onChange,
  searchTimeout = 1000,
  defaultEvent,
  options: initialOptions = [],
}: SubmissionsAutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] =
    useState<readonly EventResult[]>(initialOptions);
  const [loading, setLoading] = useState(false);
  const [inp, setInp] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (inp.length > 0) {
        try {
          setLoading(true);
          const res = await getAxios().get(
            `/events?q=${encodeURIComponent(inp)}`
          );
          const events = res.data.data;
          console.log({ events });
          setOptions(events);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }, searchTimeout);
  }, [inp, searchTimeout]);

  return (
    <Autocomplete
      id="events-autocomplete"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      defaultValue={defaultEvent}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Event"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          onChange={(e) => setInp(e.target.value)}
        />
      )}
      onChange={(e, value) => {
        if (value) {
          onChange(value);
        }
      }}
      noOptionsText={"Start typing to search events"}
    />
  );
}
