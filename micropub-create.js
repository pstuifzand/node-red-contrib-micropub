var Micropub = require('micropub-helper');

module.exports = function (RED) {
    function MicropubNode(config) {
        RED.nodes.createNode(this, config);

        this.endpoint = RED.nodes.getNode(config.endpoint);

        var node = this;

        node.on('input', function (msg) {
            try {
                const micropub = new Micropub({
                    micropubEndpoint: node.endpoint.credentials.micropub_endpoint,
                    token: node.endpoint.credentials.auth_token
                });
                var location = micropub.postMicropub(msg.payload);
                msg.location = location;
                node.send(msg);
            } catch (e) {
                node.error(e);
            }
        });
    }

    RED.nodes.registerType("micropub-create", MicropubNode);
}

