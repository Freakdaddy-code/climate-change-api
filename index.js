const PORT = process.env.PORT || 8000; //for heroku deployment
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "times",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science-environment-56837908",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "independent",
    address: "https://www.independent.co.uk/climate-change/news",
    base: "https://www.independent.co.uk",
  },
  {
    name: "dm",
    address: "https://www.dailymail.co.uk/sciencetech/index.html",
    base: "https://www.dailymail.co.uk",
  },
  {
    name: "nypost",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
  {
    name: "nytimes",
    address: "https://www.nytimes.com/international/section/climate",
    base: "https://www.nytimes.com",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "sydneymh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "un",
    address: "https://www.un.org/climatechange",
    base: "",
  },
  {
    name: "cityam",
    address: "https://www.cityam.com/news/",
    base: "",
  },
  {
    name: "dailyrecord",
    address: "https://www.dailyrecord.co.uk/all-about/climate-change",
    base: "",
  },
  {
    name: "onion",
    address: "https://www.theonion.com/breaking-news",
    base: "",
  },
  {
    name: "skynews",
    address: "https://news.sky.com/climate",
    base: "https://news.sky.com",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my climate change News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
