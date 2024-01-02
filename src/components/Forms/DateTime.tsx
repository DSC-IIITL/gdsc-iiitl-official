import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type FormInputDateProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  readOnly?: boolean;
};

export const FormInputDate = ({
  name,
  control,
  label,
  readOnly = false,
}: FormInputDateProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DateTimePicker
            label={label}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            {...(value && { value: dayjs(value as Date) })}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(value: any) => {
              onChange(new Date(value.$d.toISOString()));
            }}
            readOnly={readOnly}
          />
        )}
      />
    </LocalizationProvider>
  );
};
