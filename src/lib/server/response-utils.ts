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

export function isValidBody(body: never, fields: string[]) {
  // TODO: Use Zod instead
  if (body === undefined) {
    return false;
  }
  for (const field of fields) {
    if (body[field] === undefined) {
      return false;
    }
  }
  return true;
}
