import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { GoogleMaps, GoogleMap, GoogleMapOptions, Marker, Environment, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { Device } from '@ionic-native/device';

import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mapita: GoogleMap;

  markers = [];

  miPosicion: any;

  ref = firebase.database().ref('geolocation/');

  constructor(public navCtrl: NavController, public plataforma: Platform, private geolocaclizacion: Geolocation, private dispositivo: Device) {

    this.initMap();

    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if(data.uuid !== this.dispositivo.uuid) {
          let updatelocation = new LatLng(data.latitude,data.longitude);
          console.log(updatelocation)
          let imagen = 'assets/logo2.png';
          this.addMarker(updatelocation, imagen);
          this.setMapOnAll(this.mapita);
        } else {
          let updatelocation = new LatLng(data.latitude,data.longitude);
          console.log(updatelocation)
          let imagen = 'assets/logo1.png';
          this.addMarker(updatelocation, imagen);
          this.setMapOnAll(this.mapita);
        }
      });
    });

}

  initMap() {

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDGJpV8EuCWb6Dl8BmLZkYqJtOcDN8ud8c',
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDGJpV8EuCWb6Dl8BmLZkYqJtOcDN8ud8c'
    }) 

    this.geolocaclizacion.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let miPosicionInicial = new LatLng(resp.coords.latitude,resp.coords.longitude);
      let gmOptions: GoogleMapOptions = {
        camera: {
          target: miPosicionInicial,
          zoom: 15
        }
      }

      console.log("inicio: ", resp.coords);
    this.mapita = GoogleMaps.create('mapa', gmOptions);

    });

    let watch = this.geolocaclizacion.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      this.updateGeolocation(this.dispositivo.uuid, data.coords.latitude,data.coords.longitude);
      let miPosicionActual = new LatLng(data.coords.latitude,data.coords.longitude);
      console.log(miPosicionActual);
      let imagen = 'assets/logo1.png';
      this.addMarker(miPosicionActual, imagen);
      this.setMapOnAll(this.mapita);
    });
  }

  addMarker(location, urlImage) {
    let marcador = this.mapita.addMarker ({
      position: location,
      icon: {
        url: urlImage,
        size: {
          width: 32,
          height: 19
       }
        //size: new google.maps.Size(126, 75),
        //origin: new google.maps.Point(0, 0),
        //anchor: new google.maps.Point(17, 8),
        //scaledSize: new google.maps.Size(32, 19)
      },
    });
    this.markers.push(marcador);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      //this.markers[i].setMap(map);
      this.mapita.addMarker(this.markers[i]);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  updateGeolocation(uuid, lat, lng) {
    if(localStorage.getItem('miLlave')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('miLlave')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('miLlave', newData.key);
    }
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
