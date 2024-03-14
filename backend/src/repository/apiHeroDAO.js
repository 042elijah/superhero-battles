const logger = require("../util/logger");

const URL = `https://www.superheroapi.com/api.php/122100753632232992/`;

async function getApiHero(id) {
    const url = `${URL}${id}`;
    let h;

    await fetch(url)
        .then(res => res.json())
        .then((x) => {
            h = {
                id: x.id,
                name: x.name,
                image: {
                    url: x.image.url
                },
                powerstats: {
                    intelligence: Number(x.powerstats.intelligence),
                    strength: Number(x.powerstats.strength),
                    speed: Number(x.powerstats.speed),
                    durability: Number(x.powerstats.durability)
                },
                biography: {
                    alignment: x.biography.alignment
                }
            };
        })
        .catch(err => {
            h = {};
            logger.error(err);
        });

        return h;
}

module.exports = {
    getApiHero
};