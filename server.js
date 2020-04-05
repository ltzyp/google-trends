const googleTrends = require('google-trends-api');

const http = require('http');
//var Table = require('easy-table');

const hostname = '127.0.0.1';
const port = 3080;
var jsonParsed = {};
let txt = "bebe";
let params = {};

Array.prototype.envelopHTML = function( templates ) {      
    let t = templates[0];
    let formats = templates.slice(1,4);
    let h = '';
    this.forEach ( (e) => {
        if( Array.isArray(e) ) {
                h = h + e.envelopHTML( formats );
            } else {
                let es = e.toString;
                h = h + formats[0].replace('%s', e.toString());
            };          
    });
    return t.replace('%s',h);         
} 

Array.prototype.extendProperties = function( accessors ) {
    let result = [];
    this.forEach( (e) => {
        let a = accessors.reduce ( (acc,cur ) => {
            const v= Object.getOwnPropertyDescriptor(e, cur).value;
            return acc.concat([v]); 
        },[]);
        result.push(a.flat());  
    });
    console.log(result);
    return result;
}

const server = http.createServer((req, res) => {
  const {method,url} = req ;
  console.log(method);
  console.log(url);
  if (method=='GET' ) {
//	console.log(url);
    let path_pars = decodeURI(url).split('?');
    if ( path_pars[0].match(/\/api/) ) {
      let pars = path_pars[1].split('&'); 
      pars = pars.map( function(p) { 
           pairs = p.split('=');
		if ( pairs[1]) pairs[1]=pairs[1].split(','); 
		return pairs;
      });
      params = new Map(pars);	
//      console.log( pars ) ; 
//      console.log( params ) ; 
      let interest = params.get('keyword');
      let geo = (params.get('geo')||[''])[0];
      let resolution = params.get('resolution')[0];   
      let format = params.get('format') || 'json';
      let headerFormat = '';
      let stop = new Date( params.get('date')[0] || Date.now());
      let start = new Date( params.get('date')[1] || '2010-01-01');   
      let outputTransformer = function(data) {
            return data; 
        };
        switch ( 'json' ) {
         case 'text':
            headerFormat = 'text/html';         
            outputTransformer = function(data){
                console.log('outputTransformer');
 //               extendedData= data.extendProperties([ 'formattedTime','formattedValue']);
                return data.envelopHTML( ['<table>%s</table>','<tr>%s</tr>','<td>%s</td>'])
            };
            break;
         case 'json':
            headerFormat = 'application/json';
            outputTransformer = ( (data) => JSON.stringify(data) );
            break;
        }
      res.statusCode = 200;
      
      res.setHeader('Content-Type', headerFormat);
      res.setHeader("Access-Control-Allow-Origin", "*");

//      googleTrends["interestOverTime"]({keyword: interest } )
   let options = {keyword: interest,  resolution: resolution, startTime: start, endTime: stop  };
        if ( geo ) options.geo = geo;
       console.log(options); 
       googleTrends["interestByRegion"](options )
      .then((resAPI) => {
       jsonParsed = JSON.parse(resAPI);
//       let plainData = jsonParsed.default.timelineData.extendProperties([ 'formattedTime','formattedValue']);
       let plainData = jsonParsed.default.geoMapData.extendProperties([ 'geoCode','value']);
       toSend = outputTransformer(plainData);
        console.log('toSend:'+ toSend);
        res.write(toSend);
//      res.write( p.envelopHTML(
//            ['<table>%s</table>','<tr>%s</tr>','<td>%s</td>']
//        ) 
//      );  
 //	console.log(res);
      return res.end();
      }).catch((err) => {
       console.log('got the error', err);
       console.log('error message', err.message);
//       console.log('request body',  err.requestBody);
      });
     }
   }
// res.write("Privet "+txt+"<br>"); 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});