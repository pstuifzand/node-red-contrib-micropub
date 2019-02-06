var Micropub = require('micropub-helper');

module.exports = function (RED) {
    function IndieauthNode(n) {
        RED.nodes.createNode(this, n);
        this.client_id = n.client_id;
        this.micropub_endpoint = n.micropub_endpoint;
        this.token_endpoint = n.token_endpoint;
        this.authorization_endpoint = n.authorization_endpoint;
        this.auth_token = n.auth_token;
        this.me = n.me;
    }

    RED.nodes.registerType("indieauth", IndieauthNode);

    RED.httpAdmin.get('/indieauth/auth', function (req, res) {
        var node_id = req.query.id;

        const micropub = new Micropub({
            clientId: req.query.client_id,
            redirectUri: 'http://localhost:1881/indieauth/auth/callback',
            me: req.query.me,
            state: node_id + ':1234'
        });

        var credentials = {
            client_id: req.query.client_id,
            me: req.query.me
        };

        micropub.getAuthUrl(req.query.me).then(url => {
            credentials.micropub_endpoint = micropub.options.micropubEndpoint;
            credentials.token_endpoint = micropub.options.tokenEndpoint;
            res.redirect(url);
            RED.nodes.addCredentials(node_id, credentials);
        }).catch(err => {
            RED.log.error(err);
            res.send(err);
        });
    });

    RED.httpAdmin.get('/indieauth/auth/callback', function (req, res) {
        RED.log.info(req.query.state);
        RED.log.info(req.query.code);

        var code = req.query.code;
        var state = req.query.state.split(':');

        if (!code || !state) {
            return;
        }

        var node_id = state[0];

        var credentials = RED.nodes.getCredentials(node_id);
        if (!credentials) {
            return;
        }

        const micropub = new Micropub({
            clientId: credentials.client_id,
            redirectUri: 'http://localhost:1881/indieauth/auth/callback',
            tokenEndpoint: credentials.token_endpoint,
            state: req.query.state,
            me: credentials.me,
        });

        micropub
            .getToken(code)
            .then(token => {
                credentials.auth_token = token;
                RED.nodes.addCredentials(node_id, credentials);
                res.send('auth completed');
            }).catch(err => {
                RED.log.error(err);
                res.send(err);
            });
    });
};

