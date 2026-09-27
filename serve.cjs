const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.md':'text/plain; charset=utf-8','.json':'application/json','.woff2':'font/woff2','.zip':'application/zip'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let file;try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);file=path.resolve(root,'.'+(name==='/'?'/index.html':name));}catch{res.writeHead(400);res.end();return;}
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(error,stat)=>{if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);});
});
server.listen(4180,'127.0.0.1',()=>console.log('Slate UI: http://127.0.0.1:4180'));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
