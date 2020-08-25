const User = require('./model/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const SERVER_PORT = 3000;

app.use(express.json());

const fakeUsers = [
    new User(0, 'Harry', 'Hooker', 'harry@gmail.com', 'passwordHarry'),
    new User(1, 'Andrea', 'López', 'andres@gmail.com', 'passwordAndrea')
];

/**
 * get user by the given email.
 * @param {String} email User email.
 */
const getUserByEmail = (email) => fakeUsers.find(user => user.email === email);

app.post('/users', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userId = fakeUsers[fakeUsers.length - 1].id + 1;

    if (firstName && lastName && email && password) {

        const userByEmail = getUserByEmail(email);

        if (!userByEmail) {
            const user = new User(userId, firstName, lastName, email, password);

            fakeUsers.push(user);

            res.status(201).json({ userId });
        } else {
            res.status(409).json({ error: `There is an user with email ${email}` });
        }
    } else {
        res.status(400).json({ error: 'Malformed body request' });
    }
});

app.put('/users', (req, res) => {
    const email = req.query.email;
    const { firstName, lastName, password } = req.body;

    const user = getUserByEmail(email);

    if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.password = password || user.password;

        res.status(200).json({ user });
    } else {
        res.status(404).json({ error: `User with email ${email} not found` });
    }
});

app.get('/users', (req, res) => {
    res.status(200).json({ data: fakeUsers });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        const userByEmail = getUserByEmail(email);

        if (userByEmail) {
            if (userByEmail.password === password) {
                const token = createToken(userByEmail);

                res.status(200).json({ token });
            } else {
                res.status(404).json({ error: `Email or password incorrect` });
            }
        } else {
            res.status(404).json({ error: `Email or password incorrect` });
        }
    } else {
        res.status(400).json({ error: 'User or password empty' });
    }
});

/**
 * 
 * @param {User} user 
 * @returns {String} Token.
 */
const createToken = (user) => {
    const jwtPassword = 'mySecurePassword';

    const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, jwtPassword);

    return token;
}

/**
 * Set isAdmin user property.
 * @param {Boolean} value Is admin value.
 * @param {String} email User email.
 */
const isAdmin = (value, email) => {
    const user = getUserByEmail(email);

    user.isAdmin = value;
}

/**
 * Server listening on port 3000.
 */
app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}`));