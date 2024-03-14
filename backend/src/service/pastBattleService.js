const apiHeroDao = require('../repository/apiHeroDAO');
const customHeroDao = require('../repository/customHeroDAO');
const pastBattleDAO = require("../repository/pastBattleDAO");
const userDao = require('../repository/userDAO');
const validate = require('../util/validate');

const ALIGNMENT_BONUS_PERCENT = 15;

async function getPastBattleByUsername(username) {
    if(username){
        const data = await pastBattleDAO.getPastBattleByUsername(username);
        return data;
    }
    else{
        throw new Error("missing username or falsy value exists!")
    }
}

async function getPastBattleByBattleID(username, battleID) {
    if(battleID){
        const data = await pastBattleDAO.getPastBattleByBattleID(username, battleID);
        console.log(battleID)
        return data;
    }
    else{
        throw new Error("missing battle id/username or falsy value exists!")
    }
}

/**
 * Takes two params in the form of { username: string, teamArray: number[] }
 * Where the first param represents the challenging user and their team
 * And the second param represents the challenged user and their team
 * 
 * Can use a -1 to represent a custom hero in a user's team (order does not matter as teams will be sorted 
 * for consistency of display (i.e. The same team will (should) always be stored in the same order everytime))
 * 
 * @returns Array of steps to reproduce this battle
 */
async function simulateBattle({ challenger, challengerTeam }, { opponent, opponentTeam }) {
    // remove vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // const { simulateBattle } = require('./service/pastBattleService');
    // let battle = simulateBattle(
    //     {challenger: 'K00Lguy', challengerTeam: '[5,6,7]'}, 
    //     {opponent: 'K00Lguy', opponentTeam: '[8,9,10]'})
    //         .then(console.log)
    //         .catch(console.log);
    // // console.log(battle);
    // remove ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



    if(!validate.validateUsername(challenger) || !validate.validateUsername(opponent)) {
        return { code: 400, message: 'Malformed username' };
    }

    if(!validate.validateJsonNumArray(challengerTeam) || !validate.validateJsonNumArray(opponentTeam)) {
        return { code: 400, message: 'Malformed team array' };
    }

    if(!userDao.getUser(challenger) || !userDao.getUser(opponent)) {
        return { code: 404, message: 'User not found' };
    }

    challengerTeam = JSON.parse(challengerTeam);
    opponentTeam = JSON.parse(opponentTeam);

    let team1 = {
        username: challenger,
        heroIds: challengerTeam.toSorted((a, b) => a - b),
        heroes: []
    };

    let team2 = {
        username: opponent,
        heroIds: opponentTeam.toSorted((a, b) => a - b),
        heroes: []
    };

    const newTeam1 = await setUpTeamObj(team1);
    // Maybe should have better way of validating?
    if(newTeam1.code) {
        return newTeam1;
    }
    team1 = newTeam1;


    const newTeam2 = await setUpTeamObj(team2);
    // Maybe should have better way of validating?
    if(newTeam2.code) {
        return newTeam2;
    }
    team2 = newTeam2;


    // Simulation
    let battle = {
        challenger: team1.username,
        challengerStatBonuses: [],
        opponent: team2.username,
        opponentStatBonuses: [],

        steps: []
    };

    setTeamStatBonuses(battle, team1, team2);

    
    // Steps
    // First two steps are the award stat bonus phase
    battle.steps.push(awardStatBonusStep(team1));
    battle.steps.push(awardStatBonusStep(team2));

    // Even step index means it is team1's turn, odd means it is team2's turn
    let i = 0;
    while(i < 10 && getAliveHeroes(team1.heroes) > 0 && getAliveHeroes(team2.heroes) > 0) {
        if(i % 2 == 0) {
        }

        i++;
    }

    return battle;
}

module.exports = {
    getPastBattleByUsername,
    getPastBattleByBattleID,
    simulateBattle
}

















/**
    @returns
    team: {
        username: [is the username of the user],
        userAlignment: [will be created by this function; alignment of user]
        heroIds: [ids of the heroes on this team],
        heroes: [will be created by this function; will store actual hero stats (needed for battle steps)]
    };
 */
async function setUpTeamObj(team) {
    if(!team.username || !team.heroIds) {
        return { code: 400, message: `Malformed team object` };
    }
    
    const user = userDao.getUser(team.username);

    if(!user) {
        return { code: 404, message: 'User not found' };
    }

    team.userAlignment = user.alignment;

    // Add heroes array property to team obj
    team.heroes = [];

    let usedCustomHero = false;
    for(let i = 0, h = {}; i < team.heroIds.length; i++) {
        // If should use a custom hero
        if(team.heroIds[i] < 0) {
            if(usedCustomHero) {
                return { code: 400, message: `Can't use custom hero more than once` };
            }

            const customHero = await customHeroDao.getCustomHero(team.username);

            if(!validate.validateHero(customHero)) {
                return { code: 500, message: `Couldn't fetch custom hero` };
            }

            // CustomHero.stats is the ID of the hero that the custom hero's stats are based on
            const basis = apiHeroDao.getApiHero(customHero.stats);

            if(!validate.validateHero(basis)) {
                return { code: 500, message: `Couldn't fetch hero ID ${customHero.stats}` };
            }

            h = {
                id: customHero.id,
                name: customHero.name,
                image: {
                    url: basis.image.url
                },
                powerstats: {
                    intelligence: Number(basis.powerstats.intelligence),
                    strength: Number(basis.powerstats.strength),
                    speed: Number(basis.powerstats.speed),
                    durability: Number(basis.powerstats.durability)
                },
                biography: {
                    alignment: customHero.biography.alignment
                }
            };

            usedCustomHero = true;
        }
        else {
            h = await apiHeroDao.getApiHero(team.heroIds[i]);
        }

        if(!validate.validateHero(h)) {
            return { code: 500, message: `Couldn't fetch hero ID ${team.heroIds[i]}` };
        }

        team.heroes.push(h);
    }

    return team;
}

function setTeamStatBonuses(battle, team1, team2) {
    battle.challengerStatBonuses = getStatBonuses(team1.heroes, team1.userAlignment);
    battle.opponentStatBonuses = getStatBonuses(team2.heroes, team2.userAlignment);
}

/**
 * @returns 
 * Array of { reason, amounts: { intelligence, strength, speed, durability }, heroId } */
function getStatBonuses(heroes, alignment) {
    // Alignment bonus/penalty is the only penalty so far, but more can be added in this function
    // neutral heroes get no bonus/penalty
    let statBonuses = [];
    for(let i = 0, bonus = {}; i < heroes.length; i++) {
        const heroAlignment = heroes[i].biography.alignment;
        const heroId = heroes[i].id;
        const heroStats = heroes[i].powerstats;

        if(heroAlignment == 'neutral') {
            continue;
        }

        const getBonus = (x, predicate) => (predicate == true ? 1 : -1) * Math.floor((ALIGNMENT_BONUS_PERCENT / 100) * x);

        bonus = {
            reason: 'alignment',
            amounts: {
                intelligence: getBonus(heroStats.intelligence, heroAlignment == alignment),
                strength: getBonus(heroStats.strength, heroAlignment == alignment),
                speed: getBonus(heroStats.speed, heroAlignment == alignment),
                durability: getBonus(heroStats.durability, heroAlignment == alignment)
            }, 
            heroId
        };

        statBonuses.push(bonus);
    }

    return statBonuses;
}

function applyStatBonus(hero, bonus) {
    let newHero = hero;

    newHero.powerstats.intelligence += bonus.amounts.intelligence,
    newHero.powerstats.strength += bonus.amounts.strength,
    newHero.powerstats.speed += bonus.amounts.speed,
    newHero.powerstats.durability += bonus.amounts.durability

    return newHero;
}

/**
 * @returns { hero, index }
 */
function findHeroAndIndexById(heroes, id) {
    for(let i = 0; i < heroes.length; i++) {
        if(heroes[i].id == id) {
            return { hero: heroes[i], index: i }
        }
    }

    return { hero: null, index: -1 };
}

function getAliveHeroes(heroes) {
    let count = 0;
    for(let i = 0; i < heroes.length; i++) {
        if(heroes[i].powerstats.durability > 0) {
            count++;
        }
    }

    return count;
}

function getRandomStatTotal(team) {
    let rand = Math.random() * 100;
    let stat = '';
    
    if(rand > 66.67) {
        stat = 'intelligence';
    } else if(rand > 33.33) {
        stat = 'strength';
    }
    else {
        stat = 'speed';
    }
    
    const total = team.heroes.reduce(
      (sum, h) => sum + h.powerstats[stat],
      0
    );

    return total;
}

/**
 * The first two steps of a battle are always the stat bonus step. This function should be called twice: once for each team
 * right before the real battle steps are calculated
 */
function awardStatBonusStep(activeTeam) {
    let statBonuses = getStatBonuses(activeTeam.heroes, activeTeam.userAlignment);

    for(const bonus of statBonuses) {
        const heroIndexPair = findHeroAndIndexById(activeTeam.heroes, bonus.heroId);
        const hero = heroIndexPair.hero;
        activeTeam.heroes[heroIndexPair.index] = applyStatBonus(hero, bonus);
    }

    console.log('Remember to finish remarks in awardStatBonusStep');
    return {
        damage: 0,
        teamStats: activeTeam.heroes.reduce((stats, hero) => [...stats, hero.powerstats], []),
        remarks: []
    };
}

function calculateBattleStep(activeTeam, activeTeamBonuses, otherTeam) {
    let battleStep = {
        damage: 0,
        teamStats: [], //Array of { intelligence, strength, speed, durability }
        remarks: [] //Array of string
    };

    const totalDamage = getRandomStatTotal(activeTeam);
    battleStep.damage = totalDamage;

    // Only divide damage by the total number of living heroes on the opposing team
    const damageDivider = getAliveHeroes(otherTeam);
    // Keep damage as a decimal, going to Math.floor the health instead
    const damage = totalDamage / damageDivider;

    
}
