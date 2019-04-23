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

fastify.register(fastify_cote, {
    name: '',
    services: {
        decorator: '',
        
        expose: true,
        items: {

        }
    },
    emitters: {
        decorator: '',
        listeners: {

        } 
    },
    subscribers: {
        decorator: ''
        listeners: {

        }
    }
});
```

# Explaination

```javascript
module.exports = {
    // For defining requester & responder name.
    name: 'ExampleService',
    
    // Apply service features
    services: {
        /*
            Decorator name when accessing.
            > fastify.service 
        */
        decorator: 'service',
        /*
            Does service exposing to fastify instances & request-reply action.
            False will only expose to request-reply action.

            Default: false
        */
        expose: true,
        items: {
            /* 
                Defining services instances & accessing via
                > fastify.service.example
            */
            example: require('example')
        }
    },

    // Apply emitters
    emitters: {
        /*
            Decorator name when accessing
            > fastify.emit
        */
        decorator: 'emit',
        listeners: {
            /*
                Defining emitters & accessing via
                > await fastify.emit('example:event', payload);

                @Warn
                payload will be come a object when sending
                > requester.send({
                >    type: 'event:name',
                >    payload: 
                > });
            */
            name: 'example:event',
        }
    },

    // Apply subscribers
    subscribers: {
        /*
            Decorator name when accessing
            > fastify.sub
        */
        decorator: 'sub',
        listeners: {
            /*
                Defining emitters

                @Extra
                You alsoa ble directly access this method by
                > await fasitfy.sub('example', payload);
            */
            example: async (payload, services) => { }
        }
    }
};
```

# Maintainers

- [Oskang09](https://github.com/Oskang09)
