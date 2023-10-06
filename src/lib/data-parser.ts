export function parseData(data: string[][]) {
  // 1st row is the headers
  const headers = data.shift();
  if (headers === undefined) {
    throw new Error("Headers are undefined!");
  }

  const mappedData: { [x in string]?: string }[] = [];
  data.map((row) => {
    mappedData.push(
      row.reduce<{ [x in string]?: string }>((acc, curr, index) => {
        acc[headers[index]] = curr;
        return acc;
      }, {})
    );
  });

  return { headers, rows: mappedData };
}
