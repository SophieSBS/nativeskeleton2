'use strict';
/*
 * handlers.js
 * Requesthandlers to be called by the router mechanism
 */
const bcrypt = require('bcryptjs');                         // hashing sw
const fs = require("fs");                                   // file system access
const httpStatus = require("http-status-codes");            // http sc

const cookie = require("../controllers/sess");                // session cookies
const lib = require("../controllers/libWebUtil");           // home grown utilities
const nmlPlate = require("../controllers/myTemplater");     // home grown templater
const models = require("../models/handleSundry");           // models are datahandlers

const isLoggedIn = async function (req, res) {
    let name = cookie.get(req, res);                        // read cookie
    if (name) {                                             // logged in?
        cookie.set(req, res, name);                         // if logged in, extend
        return name;
    } else {
        return false;
    }
};

const getAndServe = async function (res, path, contentType) {   // asynchronous
    let obj;
    let args = [...arguments];                              // arguments to array
    let myargs = args.slice(3);                             // dump first three
                                                            // if more they are
                                                            // data for template

    await fs.readFile(path, function(err, data) {           // awaits async read
        if (err) {
            console.log(`Not found file: ${path}`);
        } else {
            res.writeHead(httpStatus.OK, {                  // yes, write header
                "Content-Type": contentType
            });
                                                            // call templater
            while( typeof (obj = myargs.shift()) !== 'undefined' ) {
                data = nmlPlate.doTheMagic(data, obj)       // inject var data to html
            }

            res.write(data);
            res.end();
        }
    });
};

module.exports = {
    async home(req, res) {
        let name = await isLoggedIn(req, res);
        let path = "views/index.html";
        let content = "text/html; charset=utf-8";
        getAndServe(res, path, content, {welcome: name});
    },
    login(req, res) {
        let path = "views/login.html";
        let content = "text/html; charset=utf-8";
        getAndServe(res, path, content, {msg: 'Login required'});
    },
    other(req, res) {
        let path = "views" + req.url + ".html";
        let content = "text/html; charset=utf-8";
        getAndServe(res, path, content);
    },
    js(req, res) {
        let path = "public/javascripts" + req.url;
        let content = "application/javascript; charset=utf-8";
        getAndServe(res, path, content);
    },
    css(req, res) {
        let path = "public/stylesheets" + req.url;
        let content = "text/css; charset=utf-8";
        getAndServe(res, path, content);
    },
    png(req, res) {
        let path = "public/images" + req.url;
        let content = "image/png";
        getAndServe(res, path, content);
    },
    svg(req, res) {
        let path = "public" + req.url;
        let content = "image/svg+xml";
        getAndServe(res, path, content);
    },
    ico(req, res) {
        let path ="public" + req.url;
        let content = "image/x-icon";
        getAndServe(res, path, content);
    },

    notfound(req, res) {
        console.log(`Handler 'notfound' was called for route ${req.url}`);
        res.end();
    },

    async contacts(req, res) {
        if (! await isLoggedIn(req, res)) {
            res.writeHead(httpStatus.MOVED_TEMPORARILY, {   // write header
                "Location": '/login'
            });
            res.end();
        }
        let r = await models.showContacts(req, res);
        let content = "text/html; charset=utf-8";
        let path = "views/displayContacts.html";
        getAndServe(res, path, content, {contacts: r, a: 'right aside', b: 'left aside'}); // extra arg for templater
    },

    async receiveContacts(req, res, data) {
        let obj = lib.makeWebArrays(req, data);         // home made GET and POST objects
        await models.updContacts(obj);
        res.writeHead(httpStatus.MOVED_TEMPORARILY, {   // write header
            "Location": '/'
        });
        res.end();
    },

    async verifyLogin (req, res, data) {
        let obj = lib.makeWebArrays(req, data);         // home made GET and POST objects
        let r = await models.verify(obj);
        if (r.length == 1 && await bcrypt.compare(obj.POST.password, ''+r[0].password)) {
            cookie.set(req, res, '' + r[0].name);           // create login cookie
            res.writeHead(httpStatus.MOVED_TEMPORARILY, {   // write header
                "Location": '/'
            });
            res.end();
        } else {
            res.writeHead(httpStatus.MOVED_TEMPORARILY, {   // write header
                "Location": '/logout'
            });
            res.end();
        }
    },

    async logout (req, res) {
        cookie.unset(req, res);                         // unset login cookie
        res.writeHead(httpStatus.MOVED_TEMPORARILY, {   // write header
            "Location": '/'
        });
        res.end();
    }
}