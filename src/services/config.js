import cookiehandler from 'cookie-handler';

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,""])[1].replace(/\+/g, '%20')) || null;
}

function getURLParameters(){
  var params = {
    lat: getURLParameter('latSSEE'),
    lon: getURLParameter('lonSSEE'),
    ssee:  getURLParameter('nombreSSEE'),
    zoom:  getURLParameter('zoom'),
    token:  getURLParameter('token')
  }

  return params;
}


function token(){
  return {
    read(){
      //return localStorage.getItem('token');
      return cookiehandler.get('tkn');
    },
    write(tokenValue){
      //localStorage.setItem('token', tokenValue);
      cookiehandler.set('tkn',tokenValue);
    }
  };
}

const env = {
  serviceMain: "http://gisred.chilquinta.cl:5555/arcgis/",
  CSSDIRECTORY: 'css/images/'
}

export default env;
export {getURLParameters}
