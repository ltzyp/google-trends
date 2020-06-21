const trendsStart = '2004-01-01';
    Array.prototype.extendProperties = function( accessors ) {
        let result = [];
        this.forEach( (e) => {
            let a = accessors.reduce ( (acc,cur ) => {
                const v= Object.getOwnPropertyDescriptor(e, cur).value;
                return acc.concat([v]); 
            },[]);
            result.push(a.flat());  
        });
//        console.log(result);
        return result;
    }

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
 
    Array.prototype.asyncForEach = async function (fn) {
      for (let i = 0; i < this.length; i++) {
        let pr= fn(this[i], i);
        await pr;
      }
    };

    Date.prototype.YYYYMMDD  =function() {
       let d = this.getDate();
       let m = this.getMonth()+1;
       let y = this.getFullYear();
       return y+'-'+(m<10?'0':'')+m+'-'+(d<10?'0':'')+d;  
    }

function* monthGenerator( startString, step=1 , stopString  ) {
    let current= new Date( startString || trendsStart );
    let stop = new Date( stopString || Date.now());
    while ( current < stop  ) {
        let s = current.YYYYMMDD();  
        let i =yield s ; 
        let promo = current.getMonth() + i*step ;
        current.setMonth( current.getMonth() + step  );
        current.setDate(1);
    }
} 
