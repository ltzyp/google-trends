const googleTrends = require('google-trends-api');

const http = require('http');
var Table = require('easy-table');

const hostname = '127.0.0.1';
const port = 3080;
var jsonParsed = {};
let txt = "bebe";
let params = {};

function row_wrapper( aa ) {
 let s = '<tr>';
 console.log(aa);	
 s = s+ '<td>'+aa.formattedTime+'</td>' ;
 s = s+ '<td>'+aa.formattedAxisTime+'</td>' ;
 s = s+ '<td>'+aa.formattedValue+'</td>' ;
 return s+'</tr>';
}

const server = http.createServer((req, res) => {
  const {method,url} = req ;
  console.log(method);
  console.log(url);
  if (method=='GET' ) {
    let path_pars = url.split('?');
    if ( path_pars[0].match(/\/api/) ) {
      let pars = path_pars[1].split('&'); 
      pars = pars.map( function(p) { 
           pairs = p.split('=');
		if ( pairs[1]) pairs[1]=pairs[1].split(','); 
		return pairs;
      });
      params = new Map(pars);	
      console.log( pars ) ; 
      console.log( params ) ; 
      let interest = params.get('keyword'); 
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      googleTrends["interestOverTime"]({keyword: interest } )
      .then((resAPI) => {
       jsonParsed = JSON.parse(resAPI);
       res.write('<table>');
       jsonParsed.default.timelineData.forEach(
          e => { res.write( row_wrapper(e)) }
	  );
        res.write('</table>');
        res.end("<br>the End ");	
      }).catch((err) => {
       console.log('got the error', err);
       console.log('error message', err.message);
       console.log('request body',  err.requestBody);
      });
     }
   }
 res.write("Privet "+txt+"<br>"); 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});