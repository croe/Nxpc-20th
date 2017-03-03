import $ from 'jquery';
import setUA from './util/setUaBodyClass';
import Util from './Util.js';
import GLScene from './gl/scene'

import Map from './_map';

// Application entry point
$(()=>{
  setUA();
  new GLScene();
  Map();
});
