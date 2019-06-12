const Plugin = require('fastify-plugin');
const CoteRequester = require('cote').Requester;
const CoteResponder = require('cote').Responder;

module.exports = Plugin(
    function (fastify, opts, next) {
        if (opts.requester) {
            const requesters = opts.requester.instances;
            const decorator = opts.requester.decorator || 'getRequester';
            
            fastify.decorate(decorator, function(name) {
                if (!requesters[name]) {
                    throw Error(`Requester ${name} doesn't exists.`);
                }
                return requesters[name];
            });
        }

        if (opts.responder) {
            const responder = typeof opts.responder === 'string' 
                ? new CoteResponder({ name: opts.responder })
                : opts.responder.instance;
            const decorator = opts.responder.decorator || 'respond';
            const actions = {};
            for (const name of Object.keys(opts.responder.actions)) {
                const action = opts.responder.actions[name];
                responder.on(action.event, (payload) => action.listener(payload));
                actions[name] = action.listener;
            }
            fastify.decorate(decorator, (name, payload) => {
                if (!actions[name]) {
                    throw Error(`Responder ${name} doesn't exists.`);
                }
                return actions[name](payload);
            });
        }
        return next();
    }
);