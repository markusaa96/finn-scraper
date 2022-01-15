const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const puppeteer = require('puppeteer');

const config = {
  headless: true, // Set to false if you want to open and see the robot in action
  devtools: false, // Open the devtools panel in a non headless mode
}

const titles = [
  {
    Id_title: 'Prisantydning',
  },
  {
    Id_title: 'Omkostninger',
  },
  {
    Id_title: 'Totalpris'
  },
  {
    Id_title: 'Kommunale avg.'
  },
  {
    Id_title: 'Boligtype'
  },
  {
    Id_title: 'Eieform bolig'
  },
  {
    Id_title: 'Soverom'
  },
  {
    Id_title: 'Primærrom'
  },
  {
    Id_title: 'Bruksareal'
  },
  {
    Id_title: 'Etasje'
  }
  ,
  {
    Id_title: 'Bruksareal'
  }
  ,
  {
    Id_title: 'Byggeår'
  }
  ,
  {
    Id_title: 'Energimerking'
  }
  ,
  {
    Id_title: 'Bruksareal'
  }
]

function checkObjectProperty(object_title, object_value) {
  let val = {};
  titles.forEach(el => {
    if (object_title.includes(el.Id_title)) {
      val = `"${el.Id_title}": "${object_value}"`;
      // val.Title = el.Id_title;
      // val.Value = object_value;
    }
  });

  return val;
}

const app = express();

const PORT = process.env.PORT || 3001;

app.get('/homes', async(req, res) => {
  let { finnkode } = req.query;

  let content = [];

  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  await page.goto('https://www.finn.no/realestate/homes/ad.html?finnkode=' + finnkode);

  const [XPATH_AD_TITLE_1] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/span[1]');
  const AD_TITLE_1 = await page.evaluate(name => name.innerText, XPATH_AD_TITLE_1);
  const [XPATH_AD_OBJECT_1_VALUE] = await page.$x('//*[@id="realestateClassifiedContainer"]/div[2]/div/div[1]/div/div[2]/span[2]');
  const AD_OBJECT_1_VALUE = await page.evaluate(name => name.innerText, XPATH_AD_OBJECT_1_VALUE);
  const OBJECT_1 = checkObjectProperty(AD_TITLE_1, AD_OBJECT_1_VALUE);

  const [XPATH_AD_TITLE_2] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dt[1]');
  const AD_TITLE_2 = await page.evaluate(name => name.innerText, XPATH_AD_TITLE_2);
  const [XPATH_AD_OBJECT_2_VALUE] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dd[1]');
  const AD_OBJECT_2_VALUE = await page.evaluate(name => name.innerText, XPATH_AD_OBJECT_2_VALUE);
  const OBJECT_2 = checkObjectProperty(AD_TITLE_2, AD_OBJECT_2_VALUE);

  const [XPATH_AD_TITLE_3] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dt[2]');
  const AD_TITLE_3 = await page.evaluate(name => name.innerText, XPATH_AD_TITLE_3);
  const [XPATH_AD_OBJECT_3_VALUE] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dd[2]');
  const AD_OBJECT_3_VALUE = await page.evaluate(name => name.innerText, XPATH_AD_OBJECT_3_VALUE);
  const OBJECT_3 = checkObjectProperty(AD_TITLE_3, AD_OBJECT_3_VALUE);
  
  const [XPATH_AD_TITLE_4] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dt[3]');
  const AD_TITLE_4 = await page.evaluate(name => name.innerText, XPATH_AD_TITLE_4);
  const [XPATH_AD_OBJECT_4_VALUE] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dd[3]');
  const AD_OBJECT_4_VALUE = await page.evaluate(name => name.innerText, XPATH_AD_OBJECT_4_VALUE);
  const OBJECT_4 = checkObjectProperty(AD_TITLE_4, AD_OBJECT_4_VALUE);

  const [XPATH_AD_TITLE_5] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/section[2]/dl/dt[1]');
  const AD_TITLE_5 = await page.evaluate(name => name.innerText, XPATH_AD_TITLE_5);
  const [XPATH_AD_OBJECT_5_VALUE] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/section[2]/dl/dd[1]');
  const AD_OBJECT_5_VALUE = await page.evaluate(name => name.innerText, XPATH_AD_OBJECT_5_VALUE);
  const OBJECT_5 = checkObjectProperty(AD_TITLE_5, AD_OBJECT_5_VALUE);

  content.push(JSON.parse(`{ ${OBJECT_1}, ${OBJECT_2}, ${OBJECT_3}, ${OBJECT_4}, ${OBJECT_5} }`))

  // const [XPATH_AD_COST_ESTIMATE] = await page.$x('/html/body/main/div/div[2]/div/div[1]/div/div[2]/dl[2]/dd[1]');
  // const AD_COST_ESTIMATE = await page.evaluate(name => name.innerText, XPATH_AD_COST_ESTIMATE);

  await browser.close();
  res.json(content)

  // axios.get('https://www.finn.no/realestate/homes/ad.html', { params: { finnkode: finnkode } })
  //   .then(function (response) {
  //     let data = response.data;
  //     const $ = cheerio.load(data);

  //     let content = [];

  //     let ad_title = '';

  //     // Gets title of ad
  //     $('h1').each(function () {
  //       let h1_parsed = $(this).text().replace(/\s\s+/g, ' ');
  //       if (!h1_parsed.includes('FINN.no')) {
  //         ad_title = h1_parsed;
  //       }
  //     })

  //     content.push({
  //       ad_title
  //     })

  //     res.json(content)
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   })
  //   .then(function () {
  //   });
})

app.listen({port: process.env.PORT || 3001}, () => {
  console.log(`server is running on PORT:${PORT}`);
});