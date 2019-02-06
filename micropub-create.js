var Micropub = require('micropub-helper');

module.exports = function (RED) {
    function MicropubNode(config) {
        RED.nodes.createNode(this, config);

        this.endpoint = RED.nodes.getNode(config.endpoint);

        const node = this;

        node.on('input', function (msg) {
            try {
                const micropub = new Micropub({
                    micropubEndpoint: node.endpoint.credentials.micropub_endpoint,
                    token: node.endpoint.credentials.auth_token
                });

                let entry = {};

                if (typeof msg.payload === 'string') {
                    entry.type = ['h-entry'];
                    entry.properties = {
                        content: [{
                            value: msg.payload
                        }]
                    };
                } else if (msg.payload.hasOwnProperty('type') && msg.payload.hasOwnProperty('properties')) {
                    entry = msg.payload;
                }

                msg.payload = entry;
                msg.location = micropub.postMicropub(entry);
                node.send(msg);
            } catch (e) {
                node.error(e);
            }
        });
    }

    RED.nodes.registerType("micropub-create", MicropubNode);
};

