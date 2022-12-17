// var firebase = require('firebase/app')
import {initializeApp} from 'firebase/app'

var config = {
    apiKey: "AIzaSyBCRQKsZm8Qp22YBg22PQ4t6C91OhsCc7k",
    authDomain: "projectvue-d5bab.firebaseapp.com",
    databaseURL: "https://projectvue-d5bab.firebaseio.com",
    projectId: "projectvue-d5bab",
    storageBucket: "projectvue-d5bab.appspot.com",
    messagingSenderId: "471834020906",
    appId: "1:471834020906:web:9011d11b58406de3654753"
};

var fire = firebase.initializeApp(config);
module.exports = fire