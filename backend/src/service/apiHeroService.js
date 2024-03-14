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