const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

app.get("/download", async (req, res) => {
  try {
    const { url } = req.query;
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
    const title = info.videoDetails.title;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(title)}.mp4`
    );
    ytdl(url, { format }).pipe(res);
  } catch (error) {
    console.error(error)
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});