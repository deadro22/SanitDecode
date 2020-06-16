const Decoder = require("./decoder.js");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("*", (req, res) => {
  res.render(__dirname + "/Pages/home.ejs", { cdVal: "", ctVal: "" });
});
app.post("/ttc", async (req, res) => {
  try {
    const hash = await Decoder.secure_SanitizeEncode(
      req.body.textToCode.trim(),
      true
    );
    res.render(__dirname + "/Pages/home.ejs", { cdVal: "", ctVal: hash });
  } catch (e) {
    res.render(__dirname + "/Pages/home.ejs", { cdVal: "", ctVal: e });
  }
});
app.post("/ctt", async (req, res) => {
  try {
    const val = await Decoder.secure_SanitizeDecode(
      req.body.codeToText.trim(),
      false
    );
    res.render(__dirname + "/Pages/home.ejs", {
      cdVal: val.toLowerCase(),
      ctVal: "",
    });
  } catch (e) {
    res.render(__dirname + "/Pages/home.ejs", { cdVal: e, ctVal: "" });
  }
});

app.listen(process.env.PORT || 80, () => {
  console.log("Listening");
});
