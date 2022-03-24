'use strict';
import {makeMenu, setTitles, setFooter} from './nQm.js';

const doSomething = function () {
    makeMenu('menu');
    setTitles('Native Node, Sample');
    setFooter('nml', 2021);
}
window.addEventListener('load', doSomething);