/* myTemplater.js nml templating */
"use strict";
const User = require("../models/User");           // models are datahandlers

exports.doTheMagic = function(data, obj) {
    data = '' + data;                   // buffer to string
    let regex = /xpq/g;                 // dummy regex
    let a = Object.keys(obj);           // get keys from data, 4th param, remember?
    a.forEach(function(doo) {           // loop through them to insert into all
        let regstr = `<42 ${doo} 24>`;  // materialize regex string from key
        regex = RegExp(regstr, 'g');    // create regex from that
        let s = '';
        if (typeof obj[doo] == 'object') {  // if object, primitive 
            s = `<table>`;
            for (let c of obj[doo]) {       //  loop through obj (array)
                let user = new User(c.name, c.email, c.phone);
                s += user.toString();
            }
            s += `</table>`;
        } else if (typeof obj[doo] == 'string') {
            s = obj[doo];                   // if string, place it
        }
        data = data.replaceAll(regex, s);   // actual replace
    });

    return data;
};