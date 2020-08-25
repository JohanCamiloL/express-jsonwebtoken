class User {
    constructor(id, firstName, lastName, email, password, isAdmin = false) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;