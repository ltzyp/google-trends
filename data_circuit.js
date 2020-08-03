    class DataCircuit  {
        constructor ( object ) {
        let hash= object; 
            if (object.class == String) { hash = fromElement( string )  } ;   
            for ( var key in object) { this[key]=Object.getOwnPropertyDescriptor(object,key).value };       
        }

        static fromElement( tag ) {
            h  = new Map;
            h.element = documentById
        }
        static byDefault() {

        }
/*
        constructor( name,id ) {
            element = document.getElementById(tag+id+name);
        }
*/      getValue() { this.value = this.element.value };
        value2UI() { this.element.value = this.value };
        value2URL() { return this.value };
        urlPool() { return this.name };
    }

    class DataCircuitPool {
/*
        constructor( name, array ) {
            this.pool = new Array ;
            let i= 0;
            array.forEach( (e ) => { 
               this.pool.push( new DataCircuit(name ,i++ ) ); 
            });
        }
*/     
        constructor(array) {
            this.pool =array;
        }
        innerSeparator() {  return ',' };
        integralSeparator = '&';
        urlKeyValueSeparator() {  return '=' };
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
//                  return;  
                }
            return a;  
        }
        clause() { return this.urlClauses().join(this.integralSeparator) }
    }

const dc1 = new DataCircuit( { name: 'bag', id:1, value: 'X' } ); 
const dc2 = new DataCircuit( { name: 'pool', id:1, value: 'Y' } ); 
const dc3 = new DataCircuit( { name: 'pool', id:2,  value: 'Z' } ); 
const dc = new DataCircuitPool([dc1,dc2,dc3]);
    console.log(dc.urlKeys());
    console.log(dc.urlPools());     
    console.log(dc.urlClauses());
    console.log(dc.clause());
    