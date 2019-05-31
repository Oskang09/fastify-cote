const Plugin = require('fastify-plugin');
const CoteRequester = require('cote').Requester;
const CoteResponder = require('cote').Responder;

module.exports = Plugin(
    function (fastify, opts, next) {
        if (opts.requester) {
            const requester = typeof opts.requester === 'string' 
                ? new CoteRequester({ name: opts.requester })
                : opts.requester;
            const decorator = opts.requester.decorator || 'request';
            const actions = {};
            for (const name of Object.keys(opts.requester.actions)) {
                const action = opts.requester.actions[name];
                actions[name] = function (payload) {
                    const outgoing = action.beforeRequest 
                        ? action.beforeRequest(payload)
                        : payload;
                    if (outgoing instanceof Promise) {
                        return new Promise(
                            async (resolve, reject) => {
                                try {
                                    resolve(
                                        await requester.send({
                                            type: action.event,
                                            payload: await outgoing
                                        })
                                    );
                                } catch (error) {
                                    reject(error);
                                }
                            }
                        );
                    } else {
                        return requester.send({
                            type: action.event,
                            payload: outgoing
                        });
                    }
                }
                actions[name].bind(fastify);
            }
            fastify.decorate(decorator, async (name, payload) => {
                if (!actions[name]) {
                    return requester.send({
                        type: name,
                        payload
                    });
                }
                return actions[name];
            });
        }

        if (opts.responder) {
            const responder = typeof opts.responder === 'string' 
                ? new CoteResponder({ name: opts.responder })
                : opts.responder;
            const decorator = opts.responder.decorator || 'respond';
            const actions = {};
            for (const name of Object.keys(opts.responder.actions)) {
                const action = opts.responder.actions[name];
                responder.on(action.event, (payload) => action[name].listener(payload.payload));
                actions[name] = action[name].listener;
            }
            fastify.decorate(decorator, async (name, payload) => {
                if (!actions[name]) {
                    throw Error(`Responder ${name} doesn't exists.`);
                }
                return actions[name];
            });
        }
        return next();
    },
    {
        fastify: '<=2.3.0',
        name: 'fasitfy-cote'
    }
);