import $ from 'jquery';
import setUA from './util/setUaBodyClass';
import Util from './Util.js';

import Map from './_map';

// Application entry point
$(()=>{
  setUA();
  Map();
});