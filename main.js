const express = require("express");
const cors = require("cors");
const request = require("request-promise");
const cheerio = require("cheerio");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/chibekhoonam", async (req, res) => {
  try {
    const { url } = req.body;
    const html = await request(url);
    const $ = cheerio.load(html);
    const attributes = [];
    $("div[id='additional_information'] > div[class='row fichrow']").each(
      (index, elm) => {
        const title = $(elm).find("div[class='col-md-7'] > span").text().trim();
        const value = $(elm)
          .find("div[class='col-md-17'] > span")
          .text()
          .trim();
        attributes.push({ title, value });
      }
    );
    res.send(attributes);
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

app.post("/gajmarket", async (req, res) => {
  try {
    const { url } = req.body;
    const html = await request(url);
    const $ = cheerio.load(html);
    const productId = $("div[class='product__review-form'] > input").attr(
      "value"
    );
    const attributes = (
      await axios.get(
        `https://www.gajmarket.com/api/v1/product/${productId}/attributes`
      )
    ).data;
    res.send(attributes);
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

app.listen(3000, () => console.log("server is listening..."));
