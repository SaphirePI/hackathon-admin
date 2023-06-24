'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
    async createBetterArticle(ctx) {
        console.log("Статья создается");


        const articleURL = ctx.query.link;
        const articlePages = ctx.query.pages;
        const forceWhisper = ctx.query.force || false;

        if (!articlePages || !articleURL) {
            ctx.body = {
                error: 422,
                message: "Не предоставлен link, или pages."
            }
            return;
        }

        const response = await fetch("http://127.0.0.1:8000/article/", {
            "headers": {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8,en-RU;q=0.7,ru-RU;q=0.6,en-GB;q=0.5",
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                number_of_paragraphs: articlePages,
                url: articleURL,
                force_whisper: forceWhisper
            }),
            "method": "POST",
        });

        const res = await response.json();

        console.log("Пишу результат в базу данных")
        const entry = await strapi.entityService.create('api::article.article', {
            data: {
                data: res,
                publishedAt: new Date()
            },
        });

        console.log(entry);

        ctx.body = res;
    }
}));
