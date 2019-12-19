const Router = require('koa-router');

const index = new Router();

index.get('/', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

index.get('/meals', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

index.get('/washer', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

index.get('/schedule', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

index.get('/point', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

module.exports = index;