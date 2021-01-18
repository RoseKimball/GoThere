const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/UserController');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization
            if(authToken) {
               currentUser = await findOrCreateUser(authToken);
            }
        } catch(err) {
            console.log('unable to authorize user')
        }
        return { currentUser };
    }
})

server.listen();

/* The apollo server takes typeDefs, resolvers, and context. 
 The TypDef containts types (user, category, etc.) that describe what information our server should return for different requests
 The typdef also has type Query, that describe what type our resolver should return for each query
 GQL client library is used to make a request on the frontend. The context function in Apollo Server takes the request and decides what 
 to do with it, either send it to the controller function or throw an error
 The controller does some stuff to it (in case of login, will either find or create user) and then context function returns the results
 as an object to be used in the resolver
 The resolver takes context as one of the arguments, then finally the proper query will match up
 with the same one in typedefs, and return the specified fields as a response to the front end.
*/
