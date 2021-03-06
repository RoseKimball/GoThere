const { AuthenticationError, PubSub } = require('apollo-server');
const Pin = require('./models/Pin');

const pubSub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in')
    }
    return next(root, args, ctx, info);
}


module.exports = {
    Query : {
        me: authenticated((root, args, ctx) => ctx.currentUser),
        getPins: async (root, args, ctx) => {
            const pins = await Pin.find({}).populate('author').populate('comments.author');
            return pins;
        }
    },

    Mutation: {
        createPin: authenticated(async (root, args, ctx) => {
            const pinAdded = await new Pin({
                ...args.input,
                author: ctx.currentUser._id
            }).populate('author').save()
            pubSub.publish(PIN_ADDED, { pinAdded })
            return pinAdded;
        }),
        deletePin: authenticated(async (root, args, ctx) => {
            const pinDeleted = await Pin.findOneAndDelete({_id: args.pinId}).exec();
            pubSub.publish(PIN_DELETED, { pinDeleted })
            return pinDeleted;
        }),
        createComment: authenticated(async (root, args, ctx) => {
            try {
                console.log('line 33 resolvers')
                const newComment = {text: args.text, author: ctx.currentUser._id}
                console.log(newComment);
                const pinUpdated = await Pin.findOneAndUpdate(
                    {_id: args.pinId},
                    {$push: {comments: newComment}},
                    {new: true}
                ).populate('author').populate('comments.author')
                pubSub.publish(PIN_UPDATED, { pinUpdated })
                return pinUpdated;
                console.log('backend res sent create comment', pinUpdated)
            } catch(err) {
                console.log('error creating comment', err)
            }
        })
    },

    Subscription: {
        pinAdded: {
            subscribe: () => pubsub.asyncIterator(PIN_ADDED)
        },
        pinDeleted: {
            subscribe: () => pubsub.asyncIterator(PIN_DELETED)
        },
        pinUpdated: {
            subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
        }
    }
}
