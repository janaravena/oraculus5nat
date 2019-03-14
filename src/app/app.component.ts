import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyApAtnBbp0q3X2mR0yhoq1odCkzHGj-Wg8",
  authDomain: "modulo5-jana.firebaseapp.com",
  databaseURL: "https://modulo5-jana.firebaseio.com",
  projectId: "modulo5-jana",
  storageBucket: "modulo5-jana.appspot.com",
  messagingSenderId: "447133635128"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
