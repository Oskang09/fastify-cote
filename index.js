const Plugin = require('fastify-plugin');
const CoteRequester = require('cote').Requester;
const CoteResponder = require('cote').Responder;

module.exports = Plugin(
    function (fastify, opts, next) {
        if (opts.services.expose) { 
            fastify.decorate(opts.services.decorator, opts.services.items);
        }
        
        if (opts.emitters) {
            const requester = opts.requester || new CoteRequester({ name: opts.name });
            const emits_decorator = {};
            for (const name in opts.emitters.listeners) {
                const event = opts.emitters.listeners[name];

                emits_decorator[name] = (payload) => requester.send({
                    type: event,
                    payload,
                });
            }
            fastify.decorate(opts.emitters.decorator, async (name, payload) => {
                if (!emits_decorator[event]) {
                    throw new Error(`Requester ${event} doesn't exists.`);
                }
                const result = await emits_decorator[name](payload);
                if (result.ok) {
                    return result.res;
                } else {
                    throw result.err;
                }
            });
        }

        if (opts.subscribers) {
            const responder = opts.responder || new CoteResponder({ name: opts.name });
            const subs_decorator = {};
            for (const event in opts.subscribers.listeners) {
                const listener = opts.subscribers.listeners[event];

                responder.on(event, (payload) => listener(payload.payload, opts.services.items));
                subs_decorator[event] = (payload) => listener(payload, opts.services.items);
            }
            fastify.decorate(opts.subscribers.decorator, async (event, payload) => {
                if (!subs_decorator[event]) {
                    throw new Error(`Responder ${event} doesn't exists.`);
                }
                const result = await subs_decorator[event](payload, opts.services.items);
                if (result.ok) {
                    return result.res;
                } else {
                    throw result.err;
                }
            });
        }
        next();
    },
    {
        fastify: '<=2.3.0',
        name: 'fasitfy-cote'
    }
);