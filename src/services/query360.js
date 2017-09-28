
import layers from './config';
import {getURLParameters} from './config';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import Color from 'esri/Color';

//extrae nombre y kva de sed
function getSSEELocation(ssee, token){
  console.log("ssee",ssee,token)
  var promise = new Promise((resolve, reject)=>{

    var params = getURLParameters();
    var qTaskInterruptions = new esri.tasks.QueryTask("http://gisred.chilquinta.cl:5555/arcgis/rest/services/Varios/360/MapServer/0?f=json&token=" + token);
    var qInterruptions = new esri.tasks.Query();

    qInterruptions.returnGeometry = true;
    qInterruptions.outFields=["*"];
    qInterruptions.where = "SSEE='" + ssee + "'";

    qTaskInterruptions.execute(qInterruptions, (featureSet)=>{

      if(!featureSet.features.length){
        resolve([]);
      }
      var myExtend= new esri.graphicsExtent(featureSet.features);
      console.log("geometria",featureSet);
      let x = {
        f: featureSet,
        extent: myExtend
      };

      resolve(x);
    }, (Errorq)=>{
        console.log(Errorq,"Error doing query for getSSEELocation");
        reject([]);
    });

  });
  return promise;
}


function makeSymbol(){
  return {
    makePoint(){
      var mySymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        30,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 40, 255, 1]),
          1
        ),
        new Color([204, 204, 254, 0.1])
      );

      return mySymbol;
    }
  }
}


export {getSSEELocation}
export default makeSymbol()
