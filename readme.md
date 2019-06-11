# fastify-cote

Fastify plugin for work with Cote easier by adding decorator & helpers for reply-mechanism.

# Installation

Using npm:
```
$ npm i --save fastify-cote
```

# Registering Plugins
```javascript
const fastify = require('fastify')();
const fastify_cote = require('fastify-cote');
const CoteRequester = require('cote').Requester;
const CoteResponder = require('cote').Responder;

fastify.register(fastify_cote, {
    requester: {
        decorator: 'getRequest',
        instances: {
            first: new CoteResponder({ name: 'request' }),
            server: new CoteResponder({ name: 'request' })
        }
    },
    responder: {
        instance: 'runService' || new CoteResponder({ name: 'respond' }),
        decorator: 'run',
        actions: {
            updateUser: {
                event: 'user.update',
                listener: async function (payload) {
                    // code for update user
                    // access fastify instance using `this`
                }
            }
        }
    }
});
```

# Explaination

```javascript
module.exports = {

    requester: {
        // Can only be 'string', you would access using `fastify.getRequester(name);` 
        decorator: 'getRequester',
        instances: {
            // Must be key, `cote.requester` instances
            first: new CoteResponder({ name: 'request' }),
            server: new CoteResponder({ name: 'request' })
        },

        /*
            When trying access requester with these denifition using
            > const response = await fastify.getRequester('first').send({
            >    type: 'event',
            >    payload: {
            >        ...data
            >    }
            > });
        */
    },
    responder: {
        // Can be `string` or `cote.responder` instances
        instance: 'respond' || new CoteResponder({ name: 'respond' }),
        
        // Can only be 'string', you would access using `fastify.run(action, payload);` 
        decorator: 'runService',

        actions: {

            // A custom name for let you access faster or easier when using `decorator`
            updateUser : {

                // Target server-side event name when requesting
                event: 'update.user',
                
                // Run action when someone `requesting` this or accessing using `fastify.run();`
                listener: async function (payload) {
                    // access fastify instance using `this`
                }
            }
        }
        /*
            When trying access responder with these denifition using
            > const response = await fastify.runService('updateUser', { name: 'oska' });

            Responder will receive the whole object as payload
            * when accessing using requester, 'payload' only passed into listener.
        */
    }
};
```

# Changelog

- 0.0.1 Release
- 0.0.2 Update requester method to async or non-async
- 0.0.3 Fix missing services issues
- 0.0.4 Fix emmiter issues
- 0.0.5 Planning new & better structure after tested
- 0.1.0 Better and new structure 
- 0.1.1 Fix minor issues
- 0.1.5 Added multiple requester

# Maintainers

- [Oskang09](https://github.com/Oskang09)
