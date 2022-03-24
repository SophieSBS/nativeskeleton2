'use strict';
/*
 * models
 * handlers for data manipulation
 */
const maria = require("mariadb");                               // file system access
const dbp = require('./dbParams.js');
const bcrypt = require('bcryptjs');

module.exports = {
    async updContacts(obj) {
        console.table(dbp);
        const dbh = await maria.createConnection(dbp);
        let hashed = await bcrypt.hash(obj.POST.password, 10);
        let sql = `insert into user values('${obj.POST.name}', '${obj.POST.email}', '${obj.POST.phone}', '${hashed}')`;
        await dbh.query(sql);
    },

    async showContacts () {
        const dbh = await maria.createConnection(dbp);
        const rows = await dbh.query('select * from user');
        return rows;
    },

    async verify(obj) {
        const dbh = await maria.createConnection(dbp);
        let sql = `select name, password from user where email = '${obj.POST.email}'`;
        let rows = await dbh.query(sql);
        return rows;
    }
}