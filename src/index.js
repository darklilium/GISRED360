
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Map from 'esri/map';

class GR360 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount(){

    }

    render() {
        return (
            <div className="web-wrapper">
              <div className="photo-container">
              </div>
              <div className="map-container">
              </div>
            </div>
        );
    }

}

ReactDOM.render(<GR360 />, document.getElementById('app'));
