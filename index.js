const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { url } = req.body;
  await page.goto(url);

  const products = await page.evaluate(() => {
    return {
      productName: document.querySelector("#product .h1").innerHTML,
      productPrice: document.querySelector(
        "#product div.col-12 div.variant-list-price"
      ).innerHTML,
      productDiscount: document.querySelector(
        "#product div.col-12 div.product-discount-flag"
      ).innerHTML,
      productFinalPrice: document.querySelector(
        "#product div.col-12 div.product-price"
      ).innerHTML,
    };
  });
  console.log("Products:", products);
  await browser.close();
});

app.listen("3000", () => {
  console.log("Server started");
});
