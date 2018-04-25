import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDtAlpzIewNdgrglz-rU7CS8Touhes5Vuc",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `550px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={16} defaultCenter={{ lat: 47.6965, lng: 8.6345 }}>
      <Marker label="A" title="Kammgarn" position={{ lat: 47.6944688, lng: 8.6363160 }} />
      <Marker label="B" title="MKS Musikschule" position={{ lat: 47.6950209, lng: 8.6341066 }} />
      <Marker label="C" title="Museum zu Allerheiligen" position={{ lat: 47.695042, lng: 8.635481 }} />
      <Marker label="D" title="Stadttheater" position={{ lat: 47.6957277, lng: 8.633034 }} />
      <Marker label="E" title="Haberhaus Bühne" position={{ lat: 47.6953402, lng: 8.6320005 }} />
      <Marker label="F" title="Radio Munot" position={{ lat: 47.6969773, lng: 8.6350129 }} />
  </GoogleMap>
));

export default MyMapComponent;

// <Marker label="G" title="Fassbühne" position={{ lat: 47.698224, lng: 8.636252}} />
// <Marker label="H" title="Probebühne Cardinal" position={{ lat: 47.700694, lng: 8.63605}} />
// <Marker label="I" title="Stadtbibliothek" position={{ lat: 47.6953822, lng: 8.6370836}} />
