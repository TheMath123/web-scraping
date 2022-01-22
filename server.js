const express = require('express');
const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

const server = express();

server.get('/', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.usahempbrasil.com/medicos', {
    waitUntil: 'networkidle2',
  });

  const pageData = await page.evaluate(() => {
    const data = document.getElementsByClassName("doc_info");
    let doctorsInfo = [];

    for (let index = 0; index < data.length; index++) {
      doctorsInfo.push({
        doctorName: data[index].getElementsByTagName('h1')[0].innerHTML,
        speciality: data[index].getElementsByClassName('speciality')[0].innerText,
        crm: data[index].getElementsByClassName('crm')[0].innerText,
        contact: {
          phone: data[index].getElementsByClassName('doc_contact')[0].getElementsByTagName('a')[0].href.replace('tel:', ''),
          whatsapp: data[index].getElementsByClassName('doc_contact')[0].getElementsByTagName('a')[1].href
        }
      })
    }

    return doctorsInfo;
  });

  await browser.close();

  (async () => {
    const csv = new ObjectsToCsv(pageData);

    // Save to file:
    await csv.toDisk('./data/dataDocInfo.csv');

    // Return the CSV file as string:
    console.log('CSV file created successfully');
  })();

  res.send('file:./data/');
})

const port = 5555;
server.listen(port, () => console.log(`Server is running em http://localhost:${port}`));
