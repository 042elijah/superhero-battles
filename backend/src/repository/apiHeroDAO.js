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

// Valid IDs in API are 1-731 with 166 of the heroes being unusable for this project (missing stats, etc.)
// ~567 usable heroes in the API
async function getRandomApiHero() {
    const min = 1;
    const max = 731;
    const id = Math.floor(Math.random() * (max - min) + min);

    return await getApiHero(id);
}

module.exports = {
    getApiHero,
    getRandomApiHero
};