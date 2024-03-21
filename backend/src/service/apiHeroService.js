const apiHeroDao = require('../repository/apiHeroDAO');
const validate = require('../util/validate');

async function getApiHero(id) {
    if(!Number(id)) {
        return {code: 400, message: 'Malformed hero ID' };
    }

    let hero = await apiHeroDao.getApiHero(id);

    if(!hero) {
        return {code: 404, message: 'Hero not found' };
    }

    if(!validate.validateHero(hero)) {
        return {code: 500, message: 'Hero has missing stats' };
    }

    return hero;
}

async function getRandomApiHero() {
    let h;

    do {
        h = await apiHeroDao.getRandomApiHero();
    }
    while(!validate.validateHero(h));

    return h;
}

async function getUniqueRandomHeroTeam(count) {
    let team = [];

    for(let i = 0; i < count; i++) {
        const hero = await getRandomApiHero();

        if(hero.id && team.includes(hero.id)) {
            i--;
            continue;
        }

        team.push(hero.id);
    }

    return team;
}

module.exports = {
    getApiHero,
    getRandomApiHero,
    getUniqueRandomHeroTeam
};