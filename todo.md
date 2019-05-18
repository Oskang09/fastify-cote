Registering Plugins

```
    /*
        Use your own requester /  responder instead creating new instances
        ! 'name' would be ignored if both of these exists.
    */
    requester: new CoteRequester(),
    responder: new CoteResponder(),

    requester: {
        instance: undefined || 'name' || new CoteResponder(),
        decorateAS: 'emit',
        /*
            Empty mean all able to send whatever action to other

            await fastify.emit('example:event', payload);

            @Output
            {
                type: 'example:event',
                payload
            }
        */
        actions: [
            'example:event',
            'exampe:event2'
        ],
    },
    responder: {
        instance: undefined || 'name' || new CoteResponder(),
        decorateAs: 'run',
        /*
            Defining listeners and these listeners was able to act as 
            a helpers and invoke when runtime.

            await fastify.run('example', payload);
        */
        actions: {
            example: async function (payload) {
                this === fastify
            }
        }
    },
```