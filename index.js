const Plugin = require('fastify-plugin');
const CoteRequester = require('cote').Requester;
const CoteResponder = require('cote').Responder;

module.exports = Plugin(
    function (fastify, opts, next) {

        if (opts.services.expose) { 
            fastify.decorate(opts.services.decorator, opts.services.items);
        }
        
        if (opts.emitters) {
            const requester = new CoteRequester({ name: opts.name });
            const emits_decorator = {};
            for (const event in opts.emitters.listeners) {
                emits_decorator[event] = (payload) => requester.send({
                    type: event,
                    payload: await opts.emitters.listeners[emitter](payload, opts.services.items)
                });
            }
            fastify.decorate(opts.emitters.decorator, (event, payload) => emits_decorator[event](payload, opts.services.items));
        }

        if (opts.subscribers) {
            const responder = new CoteResponder({ name: opts.name });
            const subs_decorator = {};
            for (const event in opts.subscribers.listeners) {
                const listener = opts.subscribers.listeners[emitter];

                responder.on(event, (payload) => listener(payload.payload, opts.services.items));
                subs_decorator[event] = (payload) => listener(payload, opts.services.items);
            }
            fastify.decorate(opts.subscribers.decorator, (event, payload) => subs_decorator[event](payload, opts.services.items));
        }

        next();
    },
    {
        fastify: '2.3.0',
        name: 'fasitfy-cote'
    }
);