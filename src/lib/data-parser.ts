export function parseData(data: any[][]) {
  // 1st row is the headers
  const headers = data.shift();
  if (headers === undefined) {
    throw new Error("Headers are undefined!");
  }

  const mappedData: { [x in string]: string }[] = [];
  data.map((row) => {
    mappedData.push(
      row.reduce((acc, curr, index) => {
        acc[headers[index]] = curr;
        return acc;
      }, {})
    );
  });

  return { headers, rows: mappedData };
}
