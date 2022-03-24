'use strict';

module.exports = class User {
    constructor(name, email, phone) {
        this.name = name,
        this.email = email,
        this.phone = phone
    }

    toString() {
        return `<tr><td>${this.name}</td><td>${this.email}</td><td>${this.phone}</td></tr>`;
    }
};