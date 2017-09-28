
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Map from 'esri/map';
import env from './services/config';
import {getURLParameters} from './services/config';
import ArcGISDynamicMapServiceLayer from 'esri/layers/ArcGISDynamicMapServiceLayer';
import {getSSEELocation} from './services/query360';
import makeSymbol from './services/query360';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/graphic';

var directorioPrincipal = new String("http://gisred.chilquinta/chilquinta/assets/images/360/SSEE/");
//var directorioPrincipal = new String("http://gisred.chilquinta.cl:5555/360/");

//var directorioPrincipal = new String("360/");

var slash = "/";
var panoNom = new String("");
var extension = new String(".jpg");
var foto;

class GR360 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          params: {},
          ubicacionFoto: '',
          initialExtent: '',
          zoom: 0
        };
    }
    componentWillMount(){

      this.setState({params: getURLParameters(), zoom: getURLParameters().zoom})
      console.log("my params", getURLParameters());

    }

    componentDidMount(){
      var map = new Map("map",{basemap: "dark-gray",center: [this.state.params.lon,this.state.params.lat],zoom: 13,sliderStyle: "small"});
      var layer = new ArcGISDynamicMapServiceLayer(env.serviceMain+"rest/services/Varios/360/MapServer?f=json&token="+this.state.params.token);
      map.addLayer(layer);
      var graphicLayer = new GraphicsLayer();
      let mySymbol = makeSymbol.makePoint();

      var promise = getSSEELocation(this.state.params.ssee, this.state.params.token);
      promise.then(result=>{
        console.log("ssee contents",result);
        result.f.features.map(feature=>{
          graphicLayer.add(new Graphic(feature.geometry,mySymbol, feature.attributes));
        })
        map.addLayer(graphicLayer);
        map.setExtent(result.extent);
        this.setState({initialExtent: result.extent, initialZoom: map.getZoom()});
        console.log(map.getZoom(), this.state.zoom);
        var z = parseFloat(this.state.zoom);
        console.log(z);
        map.setZoom(z);

      },err=>{
        console.log("err",err)
      });


      map.on('extent-change',event=>{
          if(!this.state.initialExtent){
            this.setState({initialExtent: map.extent});
          }
          var currentCenter = map.extent.getCenter();
           if (this.state.initialExtent && !this.state.initialExtent.contains(currentCenter) && event.delta && event.delta.x !== 0 && event.delta.y !== 0) {
             var newCenter = map.extent.getCenter();

             //check each side of the initial extent and if the current center is outside that extent,
             //set the new center to be on the edge that it went out on
             if (currentCenter.x < this.state.initialExtent.xmin) {
               newCenter.x = this.state.initialExtent.xmin;
             }
             if (currentCenter.x > this.state.initialExtent.xmax) {
               newCenter.x = this.state.initialExtent.xmax;
             }
             if (currentCenter.y < this.state.initialExtent.ymin) {
               newCenter.y = this.state.initialExtent.ymin;
             }
             if (currentCenter.y > this.state.initialExtent.ymax) {
               newCenter.y = this.state.initialExtent.ymax;
             }
             map.centerAt(newCenter);
          }
      });

      graphicLayer.on("click",(e)=>{
        console.log(e.graphic.attributes);
        panoNom = this.state.params.ssee;
        foto = e.graphic.attributes.NOMBRE_FOTO;
        this.setState({ubicacionFoto: directorioPrincipal.concat(panoNom).concat(slash).concat(foto).concat(extension)})

        var div = document.getElementById('your-pano');

        var PSV = new PhotoSphereViewer({
          panorama: this.state.ubicacionFoto,
          container: div,
          time_anim: false,
          navbar: true,
          usexmpdata:false

        })
      });

      map.on('zoom-end',e=>{
        console.log(this.state.initialZoom,"inicial zoom");
        console.log("event zoom",e);
        if(e.level < this.state.initialZoom){
          console.log("retornar al zoom original")
        }else{
          console.log("cambiar zoom")
        }

      });

    }

    render() {
        return (
            <div className="web-wrapper">
                <div className="photo-container">
                  <div className="photo-title"><h8>FOTO <i className="fa fa-photo" aria-hidden="true"></i></h8></div>
                  <div className="photo-div" id="your-pano"></div>
                </div>

              <div className="web-container">
                <div className="map-container">
                  <div className="map-title"><h8>MAPA <i className="fa fa-map" aria-hidden="true"></i></h8></div>
                  <div id="map"></div>
                </div>
                <div className="banner-container">
                  <img className="banner-img" src={env.CSSDIRECTORY+"gisred360_icon_pin.png"}></img>
                  <p>GISRED 360° - 2017 <br /> © Pérdidas y GIS <br /> Design by @ehernanr </p>
                </div>

              </div>
            </div>
        );
    }

}

ReactDOM.render(<GR360 />, document.getElementById('app'));
