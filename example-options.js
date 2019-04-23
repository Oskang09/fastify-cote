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

            Default: true
        */
        expose: false,
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
                > await fastify.emit.example();

                @Warn
                payload will be come a object when sending
                > requester.send({
                >    type: 'event:name',
                >    payload: 
                > });
            */
            example: async (payload) => { }
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
                Defining emitters & accessing via
                > await fastify.emit.example();

                @Extra
                You alsoa ble directly access this method by
                > await fasitfy.sub.example(payload);
            */
            example: async (payload) => {}
        }
    }
};