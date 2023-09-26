import { google } from "googleapis";
import { parseData } from "./data-parser";

export async function getSheetsData() {
  try {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const range = `Form Responses 1`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    if (!response.data.values) return null;

    try {
      const parsedData = parseData(response.data.values);
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
