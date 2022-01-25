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