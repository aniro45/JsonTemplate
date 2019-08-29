const fs = require("fs");
const http = require("http");
const url = require("url");

const htmlFile = fs.readFileSync(`${__dirname}/dataHtml.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/dataTemplate.html`, "utf-8");
const jsonFile = fs.readFileSync(`${__dirname}/frndInfo.json`, "utf-8");

const parsedJson = JSON.parse(jsonFile);

const replaceTemplate = (template, friendInfo) => {
  let output = template.replace(/{%FIRST_NAME%}/g, friendInfo.fname);
  output = output.replace(/{%LAST_NAME%}/g, friendInfo.lname);
  output = output.replace(/{%PHONE%}/g, friendInfo.tel);
  output = output.replace(/{%ADDRESS%}/g, friendInfo.address);
  output = output.replace(/{%CITY%}/g, friendInfo.city);
  output = output.replace(/{%STATE%}/g, friendInfo.state);
  output = output.replace(/{%COLLEGE%}/g, friendInfo.college);
  return output;
};

const myserver = http.createServer((request, response) => {
  const pathName = request.url;

  if (pathName == "/" || pathName == "/overview") {
    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    const htmlCard = parsedJson
      .map(Element => replaceTemplate(templateCard, Element))
      .join("");

    const output = htmlFile.replace(/{%PAGE_TEMPLATE%}/g, htmlCard);
    response.end(output);

    // response.end(output);
  } else if (pathName == "/api") {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.end(jsonFile);
  } else if (pathName == "/sample") {
    response.end("Its Just Sample fro testing Purpose!");
  } else {
    response.writeHead(404, {
      "content-Type": "text/html"
    });
    response.end(
      "<h1 style='color:red'>ERORR 404!</h1><h2>PAGE NOT FOUND</h2>"
    );
  }
});

myserver.listen("5555", "127.0.0.1", () => {
  console.log("Server is listenin on PORT 5555....");
});
