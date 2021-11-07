let http = require('http');
let fs = require('fs');
let url = require('url');

let app = http.createServer(function(request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query; //url에서 쿼리 스트링만 추출
  let pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  if(pathname === '/')
  {
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
      let templete = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
      `;
      response.writeHead(200);
      response.end(templete);
    })
  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
