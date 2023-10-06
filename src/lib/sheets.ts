import { google } from "googleapis";
import { parseData } from "./data-parser";

export function getSheetIdFromUrl(url: string) {
  return url.split("/d/")[1].split("/")[0] ?? null;
}

export async function getSheetsData(sheetId: string) {
  try {
    if (typeof window !== "undefined") {
      throw new Error("NO SECRETS ON CLIENT!");
    }
    const { privateKey } = JSON.parse(
      process.env.GOOGLE_PRIVATE_KEY || "{ privateKey : null }"
    );

    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });

    const sheets = google.sheets({ version: "v4", auth });
    const range = `Form Responses 1`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    if (!response.data.values) return null;

    try {
      const parsedData = parseData(response.data.values);
      console.log({ sheetData: parsedData.headers });
      return parsedData;
    } catch (error) {
      console.error("Error while parsing the data", error);
      return null;
    }
  } catch (error) {
    console.error("Error while retrieving data from Google Sheets", error);
    return null;
  }
}
