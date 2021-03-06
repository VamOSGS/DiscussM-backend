import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { sendMessage, getMessages } from '../db/methods';

const messages = new Router();

messages.post('/send', bodyParser(), async (ctx) => {
    await sendMessage(ctx.request.body)
        .then((res) => {
            ctx.response.body = {
                success: res.success,
            };
        })
        .catch((e) => {
            ctx.response.body = e;
        });
});

messages.patch('/messages', bodyParser(), async (ctx) => {
    await getMessages(ctx.request.body).then((res) => {
        if (res === null) {
            ctx.response.body = {messages: [], success: true};
        } else {
            ctx.response.body = {messages: res.messages, success: true};
        }
    });
});

export default messages;
