const express = require('express');
const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

const server = express();

server.get('/', async (req, res) => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `https://amame.org.br/lista-de-prescritores-de-cannabis/`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const pageData = await page.evaluate(() => {
    let option = document.createElement('option')
    option.setAttribute('value', 500)
    document.getElementsByTagName('select')[0].appendChild(option)

    document.getElementsByTagName('select')[0].selectedIndex = 4

    const data = document.getElementsByTagName('tr');

    let doctorsInfo = [];

    for (let index = 1; index < data.length; index++) {
      doctorsInfo.push({
        doctorName: data[index].getElementsByClassName('col-3')[0].innerText,
        speciality: data[index].getElementsByClassName('col-5')[0].innerText,
        crm: data[index].getElementsByClassName('col-4')[0].innerText,
        phone: data[index].getElementsByClassName('col-6')[0].innerText.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''),
        email: data[index].getElementsByClassName('col-7')[0].innerText
      })
    }

    return doctorsInfo;
  });

  await browser.close();


  (async () => {
    const csv = new ObjectsToCsv(pageData);

    // Save to file:
    await csv.toDisk(`./data/dataDocInfo.csv`);

    // Return the CSV file as string:
    console.log('CSV file created successfully');
  })();

  res.send(pageData);
})

const port = 5555;
server.listen(port, () => console.log(`Server is running em http://localhost:${port}`));
