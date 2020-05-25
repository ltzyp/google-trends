console.log("JS started");
      google.charts.load('current', {
        'packages':['geochart']
/*       //Note: you will need to get a mapsApiKey for your project.
         //See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        ,'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
*/      });
    const iWidth = 320;
    const iHeight= 200;
    const months = new Map();
    let start = new Date('2010-01-01');      
    let stop = new Date(Date.now());      
    let turn = 3;   
    let stage = { begin: new Date(start), term: 12 };
    let runner = null;
    console.log(stage); 

    stage.end = function() {
      let end = new Date(this.begin);  
          end.setMonth( end.getMonth()+ this.term );    
        return end;          
    };
    stage.shift = function( months ) {
        this.begin.setMonth( this.begin.getMonth()+ months );       
    }
    stage.id = function() { return this.begin.YYYYMMDD() };
    stage.toString= function(sep ) {
        return [this.begin.YYYYMMDD(),this.end().YYYYMMDD()].join(sep);
    }

    google.charts.setOnLoadCallback(onVisualizationLoad);

    function onVisualizationLoad() {
        var regions_div =  document.getElementById('regions_div');
        var mainframe =  document.getElementById('mainframe');
        var yearHeader =  document.getElementById('yearHeader');
        var got_text = document.getElementById('got_text');
        var buttonGO = document.getElementById('bGO');   
        var buttonHome = document.getElementById('bHome');
        var buttonPause = document.getElementById('bPause');  
        var buttonNext = document.getElementById('bNext');   
        var buttonPrev = document.getElementById('bPrev');   
        var buttonEnd = document.getElementById('bEnd');   
        var buttonChart = document.getElementById('bChart');
        var buttonText = document.getElementById('bText');
        var buttonRefresh = document.getElementById('bRefresh');
        var iGeo = document.getElementById('iGeo');
        var iResolution = document.getElementById('iResolution');
        var i1Keywords = document.getElementById('i1Keywords');
        var i2Keywords = document.getElementById('i2Keywords');
        var iStart = document.getElementById('iStart');
        var iStop = document.getElementById('iStop');
        var aGIF = document.getElementById('aGIF');
        var img = document.getElementById('img');

//    let keywords = ['лікар','врач'];
//    let geo = 'UA';    
//    let keywords = ['лікар','врач'];
//    let geo = 'US,GB,DE,FR,ES,IT,';    
    let keywords = ['messi','ronaldo'];
    let geo = 'US';
    const all_resolutions= ['COUNTRY', 'REGION',  'DMA', 'CITY'];
    let resolution = 'REGION';

    var options = {
        region: geo,
        width: iWidth,
        height: iHeight,
        legend: 'top',
        colorAxis: { minValue:0, maxValue:100, colors: ['red','honeydew', 'blue'], datalessRegionColor: 'indigo'},
      };
//options.region='155';


    function visualResolution(  resolution ) {
       if (resolution == 'COUNTRY')  return 'countries' ;  
       if (resolution == 'REGION')  return 'provinces' ;  
       if (resolution =='DMA') return 'metro';
        return  resolution;
    }
    function availableResolutions( region ) {
        if ( /world/.test(region) ) return all_resolutions.slice(0,1) ;
        if ( /\d{3}/.test(region) ) return all_resolutions.slice(0,1) ;
        if ( /US\-\w{2}/.test(region) ) return [all_resolutions[2]] ;
        if ( /US/.test(region) ) return all_resolutions.slice(1,3) ;
        return [ all_resolutions[1] ];
    };    

    function restart() {
        stage.begin = start ;
        drawData(stage);        
    }

    function remapSelectElement(el, newOptions ) {
    let i, L = el.options.length - 1;
       for(i = L; i >= 0; i--) {
          el.remove(i);
       }
       newOptions.forEach( (r) => {
       let option = document.createElement("option");
           option.text = r;
           el.add(option);
        });   
       console.log("select options "+el.options);    
    }

/*
   function createChartElement( container,month,display = "none") { 
      var chart = new google.visualization.GeoChart(element_id(container,month) );
      google.visualization.events.addListener(chart,'ready',function() {
            chart.attribute() = chart.getImageURI();
      };  
    });

    
   );

    async function animate( path, animStage, stepStage ) {
        let imgRefs = new Map();
        animStage.forEach( (stage ) => { 
            createChartElement(container,month,display:none);    
            let await result = drawData(path,stepStage);
            );
        });
        await Promise.all( ( ) {
        }); 
        let gifQueryPath = getPath(imgRefs,'','&');
        await composeGIF(gifQueryPath);
    }
*/
    function drawData(stage ) {
    let container = document.createElement("div") ;
        container.textContent = stage.toString( '-->' );
        mainframe.appendChild(container);
        container.setAttribute("month",stage.id());
    var chart = new google.visualization.GeoChart(container);
        google.visualization.events.addListener(chart,'ready',function() {
    let month =chart.container.getAttribute('month'); 

    let pngImage = document.createElement("img") ;
        png.appendChild(pngImage);
        pngImage.setAttribute("month",month);
        pngImage.src=chart.getImageURI();
        months.set( month ,{ svg: container, png: pngImage }) ;
    });  

    let path = 'http://localhost:3080/api';

        console.log(stage.begin);
        iGeo.value= geo;
    let resolutions = availableResolutions(geo);
        console.log("resolutions: "+resolutions); 
        remapSelectElement(iResolution,resolutions  );
        iResolution.value = resolutions.includes(resolution)? resolution : resolutions[0];  

        options.resolution= visualResolution(resolution);
        i1Keywords.value = keywords[0].replace('+',"\n");  
        i2Keywords.value = keywords[1].replace('+',"\n");
        iStart.value = start.YYYYMMDD();
        iStop.value = stop.YYYYMMDD();  
    
        yearHeader.textContent = stage.toString(' - '); 
    let keywordsClause = 'keyword='+keywords.join(',')
    let geoClause= geo=='world' ? null : 'geo='+geo; 
    let datesClause = 'date='+stage.toString(',');
    let resolutionClause = 'resolution='+resolution;
    let url = path+'?'+[keywordsClause,geoClause,datesClause,resolutionClause].filter(Boolean).join('&'); 
        console.log(url);

    let result =  fetch(url).then(  (response) =>  {
            response.json().then(  ( json ) => {
                   console.log(json);
                var selection =[['Region',keywords[0]]].concat(  json.map( a => [ a[0], a[1]  ] ));
                    console.log(selection);
                var  data =  google.visualization.arrayToDataTable(selection);
                     options["title"]= stage.toString( '-->' );
                     chart.draw(data, options);
                got_text.innerHTML = json.envelopHTML( ['<table >%s</table>','<tr>%s</tr>','<td color="darkolivegreen">%s</td>']);
             });
  	    });
    } ;
   
   drawData(stage);
 //  testGIF();
   function testGIF() {
    var imgs = document.querySelectorAll('img');
     var ag = new Animated_GIF(); 
     ag.setSize(iWidth, iHeight);

     imgs.forEach( (img) => {
          ag.addFrame( img );
     });
    
     ag.getBase64GIF(function(image) {
         aGIF.src = image;
    //     png.appendChild(animatedImage);
     });

    }

   function composeGIF() {
     var ag = new Animated_GIF(); 
     ag.setSize(iWidth, iHeight);

       months.forEach( function(month ) {
          console.log('month: '+month);
          ag.addFrame( month['png'] );
     });
   
     ag.getBase64GIF(function(image) {
         aGIF.src = image;
  //       viewport.appendChild(animatedImage);
     });

    }

   function move(val ) {
      stage.shift(val);
      drawData(stage);
   }

   buttonGO.onclick = function() {
     runner=   setInterval(  function f1() {
           if ( stage.end()< stop  ) {    
            move(turn);       
           }		
         },2000);	
      }
    
    buttonPause.onclick = function() {
      clearInterval(runner);
    }

    buttonHome.onclick = function() {
        restart();
    }

    buttonNext.onclick = function() {
        move(turn);
      }

    buttonPrev.onclick = function() {
        move(-turn);
      }


    buttonEnd.onclick = function() {
        drawData(stage);
    }

    buttonChart.onclick = function() {
        composeGIF();
    }  

   
/*
    buttonChart.onclick = function() {
        regions_div.style.display= 'block';
        got_text.style.display= 'none';
    }  

    buttonText.onclick = function() {
        regions_div.style.display= 'none';
        got_text.style.display= 'block';
      }  
*/
    buttonRefresh.onclick = function() {
       geo=iGeo.value;      
       options.region=geo;
       resolution=iResolution.value;      
       keywords[0]=i1Keywords.value.replace(/\r?\n/g,"+"); 
       keywords[1]=i2Keywords.value.replace(/\r?\n/g,"+");
       start = new Date(iStart.value);
       stop = new Date(iStop.value); 
       drawData(stage); 
      }  

   }                    // onVisualizationLoad

