  var fs = require('fs');
  let srcHtml = fs.readFileSync('query-params-pane.html');
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom; 

   const dom = (new  JSDOM(srcHtml)).window.document;

   const paramElements = Array.from(dom.getElementsByClassName("query-param"));  

const convertors = {
        TEXTAREA: {
            to:  function(text) {return text.replace('+',"\n")}, 
            from:  function(text) { return text.replace('\n',"+")}
        },
        SELECT: {
            to: function(text) { return text; },
            from: function(number) { return text;}
        },
        INPUT_text: {
            to: function(o ) { return o; },
            from: function( o ) { return o;}
        }
     }

   class DataCircuit  {
        constructor ( object , func = DataCircuit.default ) {
            object = func( object ); 
            for ( var key in object) { this[key]=Object.getOwnPropertyDescriptor(object,key).value };       
        }
        static default( o ) { return o;};

        static tagForConvertor(e) {
            let te =  e.nodeName;
                return te + ((te=='INPUT' ) ?  "_"+e.getAttribute('type') : '');
        }        

        static fromElement( e ) {
            console.log( e );
            let idSegments = e.id.split("-");      
            let lastSegment = (idSegments[1] ? idSegments.pop() : '');      
            let ce = convertors[DataCircuit.tagForConvertor(e)];
                console.log("ce= "+ ce);
            return { element: e, 
                   value:  e.value, 
                   index: lastSegment, 
                   name: idSegments.join("-"),
                   convertor: ce 
              };   
          }

        id() { return this.name+'-'+this.index } 
        getValue() { this.value = this.convertor["from"]( this.element.value) };
        setValue() { this.element.value = this.convertor["to"]( this.value )};
        urlPool() { return this.name };
    }

    class DataCircuitPool {

        constructor( array , func ) {
            this.pool = new Array ;
            let i= 0;
            array.forEach( (e ) => { 
               console.log("pool constructor e="+e); 
               this.pool.push( new DataCircuit( e , func ) ); 
            });
        }

        innerSeparator() {  return ',' };
        integralSeparator = '&';
        urlKeyValueSeparator() {  return '=' };
        at( str ) { return this.pool.find( (e)=>{ return e.id()==str} ) }
        urlKeys( ) {
             return this.pool.reduce( ( s , p )=> {return s.add(p.urlPool())} , new Set) 
            }; 
        urlPools() { 
             return this.pool.reduce( ( m , k )=> {
                let p = k.urlPool();
                    m[p] = ( m[p]|| new Array )
                    m[p].push( k.value ); 
                    return m;
            } , new Map) 
        }
        urlClauses() {
         let a = [];  
         let u = this.urlPools();
            
            console.log(u.bag );
            for (var key in u )  { 
                  a.push(  key  + this.urlKeyValueSeparator() + u[key].join(this.innerSeparator()) );
                }
            return a;  
        }
        clause() { return this.urlClauses().join(this.integralSeparator) }
    }
   const    dc = new DataCircuitPool(paramElements,DataCircuit.fromElement ); 
            e = dc.at("iKeywords-1");
            console.log("e is "+e);
            e.value=  "messi+pujol";
            e.setValue();
            e.value= null;
            e.getValue();
            dc.at("iKeywords-2").value = "ronaldo+ramos";

    console.log(dc.urlKeys());
    console.log(dc.urlPools());     
    console.log(dc.urlClauses());
    console.log(dc.clause());

    