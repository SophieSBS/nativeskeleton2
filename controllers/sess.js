/*
 * Session code by means of cookies (npm)
 *
 * docs: https://www.npmjs.com/package/cookies
 * promises deletion by not value, not true
 * second .sig cookie because signed
 */
const Cookie = require('cookies');
 
// Optionally define keys to sign cookie values to prevent client tampering
const keys = ['998537qåæporhgpfangæ143+575?)(%lfjgpå'];   // footprints of the keyboard kat

module.exports = {
    set: function (req, res, name) {
        let session = new Cookie(req, res, { keys: keys });
        let exp = new Date();
        exp.setMinutes(exp.getMinutes() + 10);
        session.set('login', name, { sameSite: true, signed: true, expires: exp });
    },
    unset: function (req, res) {
        let session = new Cookie(req, res, { keys: keys });
        session.set('login', { sameSite: true, signed: true, expires: Date.now() }); 
    },
    get: function (req, res) { 
        let session = new Cookie(req, res, { keys: keys });
        return session.get('login', { signed: true });
    }
}