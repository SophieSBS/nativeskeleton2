"use strict";
/*
 * check if routed handler function exists
 * if yes call it, else complain
 */
const handlers = require("../controllers/handlers");  // handlers module
const requestHandlers = {                             // application urls here
    GET: {
        "/": handlers.home,
        "/page1": handlers.other,
        "/about": handlers.other,
        "/contact": handlers.other,
        "/contacts": handlers.contacts,
        "/login": handlers.login,
        "/logout": handlers.logout,
        "/notfound": handlers.notfound,
        "js": handlers.js,
        "css": handlers.css,
        "png": handlers.png,
        "svg": handlers.svg,
        "ico": handlers.ico
    },
    POST: {
        "/contact": handlers.receiveContacts,
        "/login": handlers.verifyLogin
    }
}

module.exports = {
    route(req, res, bodydata) {
        let urls = req.url.split("?");              // separate query string from url
        req.url = urls[0];                          // clean url
        let arr = req.url.split(".");               // filename with suffix
        let ext = arr[arr.length - 1];              // get suffix
        if (typeof requestHandlers[req.method][req.url] === 'function') {       // look for route
            requestHandlers[req.method][req.url](req, res, bodydata);           // if found, call
        } else if (typeof requestHandlers[req.method][ext] === "function") {    // if css, js, png, or
            requestHandlers[req.method][ext](req, res);                         // get that
        } else {                                                                // else
            requestHandlers.GET["/notfound"](req, res);                         // use notfound
        }
    }
}