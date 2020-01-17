import express from 'express';
import schema from './apollo'
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors = require("cors");
require("dotenv").config();


const app = express();

const ws = createServer(app);

ws.listen(process.env.PORT, () => {
    console.log(`GraphQL WebSocket Server is now running on ${process.env.PORT}`);
    new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
            server: ws,
            path: '/subscriptions',
        });
});



