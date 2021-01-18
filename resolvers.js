const { AuthenticationError } = require('apollo-server');

// const user = {
//     _id: '2',
//     name: 'Rose',
//     email: 'rose@gmail.com',
//     picture: 'http://example.com'
// }

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in')
    }
    return next(root, args, ctx, info);
}

module.exports = {
    Query : {
        me: authenticated((root, args, ctx) => ctx.currentUser)
    }
}
