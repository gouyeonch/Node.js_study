let http = require('http');
let fs = require('fs');
let url = require('url');

let app = http.createServer(function(request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query; //url에서 쿼리 스트링만 추출
  let pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data',function(error, filelist){
        let title = 'Welcome';
        let description = 'Hello, Node.js';
        let list = '<ul>';
        let i = 0;
        while(i < filelist.length){
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i+=1;
        }
        list = list + '</ul>';
        let templete = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(templete);
      });
    }
    else{
      fs.readdir('./data',function(error, filelist){
        let list = '<ul>';
        let i = 0;
        while(i < filelist.length){
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i+=1;
        }
        list = list + '</ul>';
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
          let title = queryData.id;
          let templete = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(templete);
        });
      });
    }

  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
