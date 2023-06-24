'use strict';

/**
 * artikli controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::artikli.artikli', ({ strapi }) => ({
    async createArticleGPT(ctx) {
        console.log("Статья создается");


        const articleURL = ctx.query.link;
        const articlePages = ctx.query.pages;
        const articleLanguage = ctx.query.language;

        if (!articleLanguage || !articlePages || !articleURL) {
            ctx.body = {
                error: 422,
                message: "Не предоставлен link, pages или language."
            }
            return;
        }

        const response = await fetch("https://e7b7-81-177-186-60.ngrok-free.app/article/", {
            "headers": {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8,en-RU;q=0.7,ru-RU;q=0.6,en-GB;q=0.5",
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                number_of_paragraphs: articlePages,
                url: articleURL,
                lang: articleLanguage
            }),
            "method": "POST",
        });

        const res = await response.json();

        console.log("Пишу результат в базу данных")
        const entry = await strapi.entityService.create('api::artikli.artikli', {
            data: {
                data: res,
                publishedAt: new Date()
            },
        });

        console.log(entry);

        ctx.body = res;
    },
}));
