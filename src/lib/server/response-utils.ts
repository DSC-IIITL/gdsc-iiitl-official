export type APIResponse<T> = {
  message: string;
  data?: T;
  error?: string;
};

export function generateMessage<T>({ message, data, error }: APIResponse<T>) {
  return {
    message,
    data: data ?? null,
    error: error ?? null,
  };
}

export function isValidBody(body: unknown, fields: string[]) {
  // TODO: Use Zod instead
  if (typeof body !== "object" || body === null) {
    return false;
  }
  for (const field of fields) {
    if (Object.hasOwnProperty.call(body, field) === false) {
      return false;
    }
  }
  return true;
}
