const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/UserController');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;
        try {
            console.log('req headers', req.headers.authorization)
            authToken = req.headers.authorization
            if(authToken) {
               currentUser = await findOrCreateUser(authToken);
            }
        } catch(err) {
            console.log('unable to authorize user', err)
        }
        return { currentUser };
    }
})

server.listen();

