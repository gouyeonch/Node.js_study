let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring')

function templeteHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB2 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templeteList(filelist){
  let list = '<ul>';
  let i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i+=1;
  }
  list = list + '</ul>';

  return list;
}

let app = http.createServer(function(request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query; //url에서 쿼리 스트링만 추출
  let pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data',function(error, filelist){
        let title = 'Welcome';
        let description = 'Hello, Node.js';
        let list = templeteList(filelist);
        let templete = templeteHTML(title, list,
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href='/create'>create</a>`
        );
        response.writeHead(200);
        response.end(templete);
      });
    }
    else{
      fs.readdir('./data',function(error, filelist){
        let list = templeteList(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
          let title = queryData.id;
          let templete = templeteHTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href='/create'>create</a> <a href='/update?id=${title}'>update</a>`
          );
          response.writeHead(200);
          response.end(templete);
        });
      });
    }
  }
  else if(pathname === '/create'){
    fs.readdir('./data',function(error, filelist){
      let title = 'Web - create';
      let list = templeteList(filelist);
      let templete = templeteHTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `);
      response.writeHead(200);
      response.end(templete);
    });
  }
  else if(pathname === '/create_process'){
    let body = '';
    request.on('data', function(data){
      body+=data;
    });
    request.on('end', function() {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      fs.writeFile(`data/${title}`,description,'utf8',function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  }
  else if(pathname === '/update'){
    fs.readdir('./data',function(error, filelist){
      let list = templeteList(filelist);
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
        let title = queryData.id;
        let templete = templeteHTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"</p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          `,
          `<a href='/create'>create</a> <a href='/update?id=${title}'>update</a>`
        );
        response.writeHead(200);
        response.end(templete);
      });
    });
  }
  else if(pathname === '/update_process'){
    let body = '';
    request.on('data', function(data){
      body+=data;
    });
    request.on('end', function() {
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`,description,'utf8',function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    });
  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
