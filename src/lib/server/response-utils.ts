export function generateMessage({
  message,
  data,
  error,
}: {
  message: string;
  error?: string;
  data?: any;
}) {
  return {
    message,
    data: data ?? null,
    error: error ?? null,
  };
}

export function isValidBody(body: any, fields: string[]) {
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
