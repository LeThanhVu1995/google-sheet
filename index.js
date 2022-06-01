const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: "*" }));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

app.post("/saveInformation", async (req, res) => {
  const { email, fullname, mobile } = req.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId =
    process.env.SPREAD_SHEET_ID ||
    "1jXjJ7Qard14YU6n6XValJ5oSj0d-hA_8cbCj9oGeshw";
  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });

  const title = metaData.data.sheets[0].properties.title;
  // const getRows = await googleSheets.spreadsheets.values.get({
  //   auth,
  //   spreadsheetId,
  //   range: `${title}!A:A`,
  // });

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `${title}!A:C`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[fullname, email, mobile]],
    },
  });

  res.send({ success: true });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
