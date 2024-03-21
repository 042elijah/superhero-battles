// const apiHeroDao = require('../repository/apiHeroDAO');
// const customHeroDao = require('../repository/customHeroDAO');
const pastBattleDAO = require("../repository/pastBattleDAO");
const userDao = require('../repository/userDAO');
const validate = require('../util/validate');

const apiHeroService = require('../service/apiHeroService');
const customHeroService = require('../service/customHeroService');
const userService = require('../service/userService');


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
        return data;
    }
    else{
        throw new Error("missing battle id/username or falsy value exists!")
    }
}

async function getLeaderBoard() {
    const data = await pastBattleDAO.getLeaderBoard();

    return data;
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
    if(!validate.validateUsername(challenger) || !validate.validateUsername(opponent)) {
        return { code: 400, message: 'Malformed username' };
    }
    
    if(challenger == opponent) {
        return { code: 400, message: 'A user cannot battle themself' };
    }

    if(!validate.validateNumArray(challengerTeam) || !validate.validateNumArray(opponentTeam)) {
        return { code: 400, message: 'Malformed team array' };
    }

    let challengerUser, opponentUser;

    try {
        challengerUser = await userService.getUser(challenger);
        challengerUser = challengerUser.Items[0];

        opponentUser = await userService.getUser(opponent);
        opponentUser = opponentUser.Items[0];
    } catch (error) {
        console.error(error.message);
    }

    if(!(challengerUser && challengerUser.username) || !(opponentUser && opponentUser.username)) {
        return { code: 404, message: 'User not found' };
    }

    // Pass in 0 in the request to get a random hero (0 is not a taken hero id in the api anyways so it is safe)
    // Pass in -1 to use the user's custom hero (handled later)
    const neededRandomHeroes = [...challengerTeam, ...opponentTeam].reduce((sum, x) => x == 0 ? sum + 1 : sum, 0);
    
    const randomHeroes = await apiHeroService.getUniqueRandomHeroTeam(neededRandomHeroes);

    let j = 0;
    for(let k = 0; k < challengerTeam.length; k++) {
        if(challengerTeam[k] == 0) {
            challengerTeam[k] = randomHeroes[j++];
        }
    }
    
    for(let k = 0; k < opponentTeam.length; k++) {
        if(opponentTeam[k] == 0) {
            opponentTeam[k] = randomHeroes[j++];
        }
    }

    let invalidHeroes = await getInvalidHeroes([...challengerTeam, ...opponentTeam]);
    if(invalidHeroes) {
        return { code: 400, message: `The following hero IDs reference heroes with missing stats: ${invalidHeroes}` }
    }

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

    let newTeam1 = await setUpTeamObj(team1);
    // Maybe should have better way of validating?
    if(newTeam1.code) {
        return newTeam1;
    }
    team1 = newTeam1;


    let newTeam2 = await setUpTeamObj(team2);
    // Maybe should have better way of validating?
    if(newTeam2.code) {
        return newTeam2;
    }
    team2 = newTeam2;

    
    // Simulation
    let battle = {
        challenger: team1.username,
        challengerStatBonuses: [],
        challengerTeam: structuredClone(team1.heroes), // (try using [...team1.heroes] if this for some reason causes problems) Want the heroes' original stats before the battle starts
        
        opponent: team2.username,
        opponentStatBonuses: [],
        opponentTeam: structuredClone(team2.heroes), // Want the heroes' original stats before the battle starts
        
        steps: []
    };
    
    let winner;

    setTeamStatBonuses(battle, team1, team2);

    
    // Steps
    // First two steps are the award stat bonus phase
    battle.steps.push(awardStatBonusStep(team1));
    battle.steps.push(awardStatBonusStep(team2));

    // Even step index means it is team1's turn, odd means it is team2's turn
    let i = 0;
    while(getAliveHeroesCount(team1.heroes) > 0 && getAliveHeroesCount(team2.heroes) > 0) {
        if(i % 2 == 0) {
            battle.steps.push(calculateBattleStep(team1, team2));
        }
        else {
            battle.steps.push(calculateBattleStep(team2, team1));
        }

        i++;
    }

    winner = i % 2 == 0 ? opponent : challenger;

    console.log('Store battle result (only usernames and battle result, not steps) here');

    // Increase user's wins and losses
    const challengerWinsLosses = { wins: challengerUser.wins, losses: challengerUser.losses };
    const opponentWinsLosses = { wins: opponentUser.wins, losses: opponentUser.losses };

    if(winner == challenger) {
        challengerWinsLosses.wins++;
        opponentWinsLosses.losses++;
    }
    else {
        opponentWinsLosses.wins++;
        challengerWinsLosses.losses++;
    }

    await userService.putUser({ username: challenger, userData: { ...challengerWinsLosses } });
    await userService.putUser({ username: opponent, userData: { ...opponentWinsLosses } });

    // const aaaa = { username: data.username, userData: { data: { ...challengerWinsLosses } } }

    return battle;
}

module.exports = {
    getPastBattleByUsername,
    getPastBattleByBattleID,
    getLeaderBoard,
    simulateBattle
}
















async function getInvalidHeroes(heroIds) {
    let invalidHeroes = [];

    for(id of heroIds) {
        // Allow negatives (because negative ID represents a custom hero; the system detects it and loads a custom hero so it is ok to 
        // allow negative IDs here)
        if(id < 0) {
            continue;
        }

        let hero = await apiHeroService.getApiHero(id);
        if(!validate.validateHero(hero)) {
            invalidHeroes.push(id);
        }
    }

    if(invalidHeroes.length > 0) {
        return invalidHeroes;
    }
    else {
        return null;
    }
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

    let dbResponse = await userService.getUser(team.username);
    const user = await (dbResponse.Items && dbResponse.Items[0]);

    if(!user) {
        return { code: 404, message: `User ${team.username} not found` };
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

            const customHeroResponse = await customHeroService.getCustomHero(team.username);
            const customHero = customHeroResponse && customHeroResponse.data;

            if(!customHero) {
                return { code: 404, message: `No custom hero found` };
            }

            // CustomHero.stats is the ID of the hero that the custom hero's stats are based on
            const basis = await apiHeroService.getApiHero(customHero.stats);
            
            // if (!validate.validateHero(customHero)) {
            //     return { code: 500, message: `Couldn't fetch custom hero` };
            // }

            if(!validate.validateHero(basis)) {
                return { code: 500, message: `Couldn't fetch hero ID ${customHero.stats}` };
            }

            h = {
                id: -1, //customHero.id,
                name: customHero.heroName,
                image: {
                    url: customHero.avatar ?? 0 // Don't use || or else if their avatar is 0, it will count as falsy and not use their avatar
                },
                powerstats: {
                    intelligence: Number(basis.powerstats.intelligence),
                    strength: Number(basis.powerstats.strength),
                    speed: Number(basis.powerstats.speed),
                    durability: Number(basis.powerstats.durability),
                    currentHealth: Number(basis.powerstats.durability) // Health changes during battle, so it is a separate value so the hero's tier doesn't change during battle
                },
                biography: {
                    alignment: customHero.alignment
                }
            };

            usedCustomHero = true;
        }
        else {
            h = await apiHeroService.getApiHero(team.heroIds[i]);
            h.powerstats.currentHealth = Number(h.powerstats.durability); // API heroes don't have the currentHealth stat so need to add it
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
 * Array of { reason, type, amounts: { intelligence, strength, speed, durability, currentHealth }, heroIndex } */
function getStatBonuses(heroes, alignment) {
    // Alignment bonus/penalty is the only penalty so far, but more can be added in this function
    // neutral heroes get no bonus/penalty
    let statBonuses = [];
    for(let i = 0, bonus = {}; i < heroes.length; i++) {
        const heroAlignment = heroes[i].biography.alignment;
        const heroStats = heroes[i].powerstats;

        if(heroAlignment == 'neutral') {
            continue;
        }

        const getBonus = (x, predicate) => (predicate == true ? 1 : -1) * Math.floor((ALIGNMENT_BONUS_PERCENT / 100) * x);

        bonus = {
            reason: 'alignment',
            type: (heroAlignment == alignment ? 'bonus' : 'penalty'),
            amounts: {
                intelligence: getBonus(heroStats.intelligence, heroAlignment == alignment),
                strength: getBonus(heroStats.strength, heroAlignment == alignment),
                speed: getBonus(heroStats.speed, heroAlignment == alignment),
                durability: getBonus(heroStats.durability, heroAlignment == alignment),
                currentHealth: getBonus(heroStats.durability, heroAlignment == alignment)
            }, 
            heroIndex: i
        };

        statBonuses.push(bonus);
    }

    return statBonuses;
}

function applyStatBonus(hero, bonus) {
    let newHero = hero;

    newHero.powerstats.intelligence += bonus.amounts.intelligence;
    newHero.powerstats.strength += bonus.amounts.strength;
    newHero.powerstats.speed += bonus.amounts.speed;
    newHero.powerstats.durability += bonus.amounts.durability
    newHero.powerstats.currentHealth += bonus.amounts.currentHealth

    return newHero;
}

function getAliveHeroesCount(heroes) {
    let count = 0;
    for(let i = 0; i < heroes.length; i++) {
        // if(heroes[i].powerstats.durability > 0) {
        if(heroes[i].powerstats.currentHealth > 0) {
            count++;
        }
    }
    
    return count;
}

function getRandomStat() {
    let rand = Math.random() * 100;

    if(rand > 66.67) {
        return 'intelligence';
    }
    else if(rand > 33.33) {
        return 'strength';
    }
    else {
        return 'speed';
    }
}

function getStatTotal(team, stat) {
    const total = team.heroes.reduce(
      (sum, h) => {
        // console.log(`${h.name} ${stat}: ${h.powerstats[stat]} ; sum: ${sum}`);
        // return sum + (h.powerstats.durability > 0 ? h.powerstats[stat] : 0);
        return sum + (h.powerstats.currentHealth > 0 ? h.powerstats[stat] : 0);
    }, /* Only allow alive heroes to do damage */
      0
    );
    // console.log(`total: ${total}\n\n`);
    return total;
}

/**
 * The first two steps of a battle are always the stat bonus step. This function should be called twice: once for each team
 * right before the real battle steps are calculated
 */
function awardStatBonusStep(activeTeam) {
    let step = {
        damage: 0,
        teamStats: [],
        globalRemarks: [],
        teamRemarks: []
    };
    let statBonuses = getStatBonuses(activeTeam.heroes, activeTeam.userAlignment);

    step.globalRemarks.push(`${activeTeam.username}'s team: Stat bonus/penalty phase`);

    for(const bonus of statBonuses) {
        const hero = activeTeam.heroes[bonus.heroIndex];
        activeTeam.heroes[bonus.heroIndex] = applyStatBonus(hero, bonus); // This may be unneeded as it changes the obj that it references (?)
        // step.remarks.push(`${hero.name}: ${ALIGNMENT_BONUS_PERCENT}% ${bonus.reason} ${bonus.type}`);

        // step.teamRemarks.push({heroIndex: bonus.heroIndex, remark: `${hero.name}: ${ALIGNMENT_BONUS_PERCENT}% ${bonus.reason} ${bonus.type}`});

        // Shorter remark; since the remarks are shown above the hero they correspond to, the name is not needed
        step.teamRemarks.push({heroIndex: bonus.heroIndex, remark: `${ALIGNMENT_BONUS_PERCENT}% ${bonus.reason} ${bonus.type}`});
    }

    step.teamStats = activeTeam.heroes.reduce((stats, hero) => [...stats, {...hero.powerstats}], []);

    return step;
}

function calculateBattleStep(activeTeam, otherTeam) {
    let battleStep = {
        damage: 0,
        teamStats: [], //Array of { intelligence, strength, speed, durability, currentHealth }
        globalRemarks: [], //Array of string
        teamRemarks: [] //Array of string
    };

    const randStat = getRandomStat();
    const totalDamage = getStatTotal(activeTeam, randStat);
    battleStep.damage = totalDamage;

    // battleStep.remarks.push(`Damage wildcard: ${randStat}`);
    // battleStep.remarks.push(`${activeTeam.username} team: does ${totalDamage} damage`);

    // battleStep.globalRemarks.push(`Damage wildcard: ${randStat}`),
    // battleStep.globalRemarks.push(`${activeTeam.username} team: does ${totalDamage} damage`);

    battleStep.globalRemarks.push(`${activeTeam.username}: does ${totalDamage} ${randStat} damage`);

    // Only divide damage by the total number of living heroes on the opposing team
    const damageDivider = getAliveHeroesCount(otherTeam.heroes);

    // Keep damage as a decimal, going to Math.floor the health instead
    const damage = totalDamage / damageDivider;

    for(let i = 0; i < otherTeam.heroes.length; i++) {
        let hero = otherTeam.heroes[i];

        // let newStats = structuredClone(hero.powerstats);
        let newStats = hero.powerstats;

        // If hero is alive, damage it
        // if(hero.powerstats.durability > 0) {
        if(hero.powerstats.currentHealth > 0) {
            // Somewhat like an easter egg
            if(!(hero.id == 503 && hero.name == 'One-Above-All')) {
                // newStats.durability = Math.round(newStats.durability - damage);
                newStats.currentHealth = Math.round(newStats.currentHealth - damage);
            }
            
            if(!(hero.id == 503 && hero.name == 'One-Above-All')) {
                // battleStep.teamRemarks.push(`${hero.name}: takes ${Math.round(damage)} damage`);
            // battleStep.teamRemarks.push({ heroIndex: i, remark: `${hero.name}: takes ${Math.round(damage)} damage` });

            // Shorter remark; since the remarks are shown above the hero they correspond to, the name is not needed
                battleStep.teamRemarks.push({ heroIndex: i, remark: `${Math.round(damage)} damage` });
            }
            else {
                battleStep.teamRemarks.push({ heroIndex: i, remark: `The One Above All takes no damage` });
            }

            // if(newStats.durability <= 0) {
            if(newStats.currentHealth <= 0) {
                // newStats.durability = 0;
                newStats.currentHealth = 0;
                // battleStep.remarks.push(`${hero.name}: dies`);
                // battleStep.teamRemarks.push({ heroIndex: i, remark: `${hero.name}: dies` }); // The slash overlay on the card makes this obvious

            }
        }

        // Always add hero's powerstats even if it is not alive (still need teamStats to maintain stat order)
        battleStep.teamStats.push({ ...newStats }); // Push a clone of stats (because want hero health to change, but want the steps to be 'snapshots' of each point int the battle)
    }

    return battleStep;
}


let b = {
    "challenger": "K00Lguy",
    "challengerStatBonuses": [
        {
            "reason": "alignment",
            "type": "bonus",
            "amounts": {
                "intelligence": 13,
                "strength": 9,
                "speed": 12,
                "durability": 15,
                "currentHealth": 15
            },
            "heroIndex": 0
        },
        {
            "reason": "alignment",
            "type": "bonus",
            "amounts": {
                "intelligence": 5,
                "strength": 12,
                "speed": 3,
                "durability": 15,
                "currentHealth": 15
            },
            "heroIndex": 1
        },
        {
            "reason": "alignment",
            "type": "penalty",
            "amounts": {
                "intelligence": -9,
                "strength": -1,
                "speed": -1,
                "durability": -15,
                "currentHealth": -15
            },
            "heroIndex": 2
        }
    ],
    "challengerTeam": [
        {
            "id": "5",
            "name": "Abraxas",
            "image": {
                "url": "https://www.superherodb.com/pictures2/portraits/10/100/181.jpg"
            },
            "powerstats": {
                "intelligence": 88,
                "strength": 63,
                "speed": 83,
                "durability": 100,
                "currentHealth": 100
            },
            "biography": {
                "alignment": "bad"
            }
        },
        {
            "id": "6",
            "name": "Absorbing Man",
            "image": {
                "url": "https://www.superherodb.com/pictures2/portraits/10/100/1448.jpg"
            },
            "powerstats": {
                "intelligence": 38,
                "strength": 80,
                "speed": 25,
                "durability": 100,
                "currentHealth": 100
            },
            "biography": {
                "alignment": "bad"
            }
        },
        {
            "id": "7",
            "name": "Adam Monroe",
            "image": {
                "url": "https://www.superherodb.com/pictures2/portraits/10/100/1026.jpg"
            },
            "powerstats": {
                "intelligence": 63,
                "strength": 10,
                "speed": 12,
                "durability": 100,
                "currentHealth": 100
            },
            "biography": {
                "alignment": "good"
            }
        }
    ],
    "opponent": "johndoe1",
    "opponentStatBonuses": [
        {
            "reason": "alignment",
            "type": "bonus",
            "amounts": {
                "intelligence": 10,
                "strength": 1,
                "speed": 4,
                "durability": 6,
                "currentHealth": 6
            },
            "heroIndex": 0
        },
        {
            "reason": "alignment",
            "type": "bonus",
            "amounts": {
                "intelligence": 1,
                "strength": 1,
                "speed": 1,
                "durability": 0,
                "currentHealth": 0
            },
            "heroIndex": 1
        },
        {
            "reason": "alignment",
            "type": "bonus",
            "amounts": {
                "intelligence": 11,
                "strength": 4,
                "speed": 5,
                "durability": 12,
                "currentHealth": 12
            },
            "heroIndex": 2
        }
    ],
    "opponentTeam": [
        {
            "id": "8",
            "name": "Adam Strange",
            "image": {
                "url": "https://www.superherodb.com/pictures2/portraits/10/100/626.jpg"
            },
            "powerstats": {
                "intelligence": 69,
                "strength": 10,
                "speed": 33,
                "durability": 40,
                "currentHealth": 40
            },
            "biography": {
                "alignment": "good"
            }
        },
        {
            "id": "10",
            "name": "Agent Bob",
            "image": {
                "url": "https://www.superherodb.com/pictures2/portraits/10/100/10255.jpg"
            },
            "powerstats": {
                "intelligence": 10,
                "strength": 8,
                "speed": 13,
                "durability": 5,
                "currentHealth": 5
            },
            "biography": {
                "alignment": "good"
            }
        },
        {
            "id": "11",
            "name": "Agent Zero",
            "image": {
                "url": "https://www.superherodb.com/pictures2/portraits/10/100/396.jpg"
            },
            "powerstats": {
                "intelligence": 75,
                "strength": 28,
                "speed": 38,
                "durability": 80,
                "currentHealth": 80
            },
            "biography": {
                "alignment": "good"
            }
        }
    ],
    "steps": [
        {
            "damage": 0,
            "remarks": [
                "Abraxas: 15% alignment bonus",
                "Absorbing Man: 15% alignment bonus",
                "Adam Monroe: 15% alignment penalty"
            ]
        },
        {
            "damage": 0,
            "remarks": [
                "Adam Strange: 15% alignment bonus",
                "Agent Bob: 15% alignment bonus",
                "Agent Zero: 15% alignment bonus"
            ]
        },
        {
            "damage": 173,
            "remarks": [
                "Damage wildcard: strength",
                "K00Lguy team: does 173 damage",
                "Adam Strange: takes 58 damage",
                "Adam Strange: dies",
                "Agent Bob: takes 58 damage",
                "Agent Bob: dies",
                "Agent Zero: takes 58 damage"
            ]
        },
        {
            "damage": 94,
            "remarks": [
                "Damage wildcard: speed",
                "johndoe1 team: does 94 damage",
                "Abraxas: takes 31 damage",
                "Absorbing Man: takes 31 damage",
                "Adam Monroe: takes 31 damage"
            ]
        },
        {
            "damage": 173,
            "remarks": [
                "Damage wildcard: strength",
                "K00Lguy team: does 173 damage",
                "Adam Strange: takes 58 damage",
                "Adam Strange: dies",
                "Agent Bob: takes 58 damage",
                "Agent Bob: dies",
                "Agent Zero: takes 58 damage"
            ]
        },
        {
            "damage": 52,
            "remarks": [
                "Damage wildcard: strength",
                "johndoe1 team: does 52 damage",
                "Abraxas: takes 17 damage",
                "Absorbing Man: takes 17 damage",
                "Adam Monroe: takes 17 damage"
            ]
        },
        {
            "damage": 134,
            "remarks": [
                "Damage wildcard: speed",
                "K00Lguy team: does 134 damage",
                "Adam Strange: takes 45 damage",
                "Agent Bob: takes 45 damage",
                "Agent Bob: dies",
                "Agent Zero: takes 45 damage"
            ]
        },
        {
            "damage": 94,
            "remarks": [
                "Damage wildcard: speed",
                "johndoe1 team: does 94 damage",
                "Abraxas: takes 31 damage",
                "Absorbing Man: takes 31 damage",
                "Adam Monroe: takes 31 damage"
            ]
        },
        {
            "damage": 173,
            "remarks": [
                "Damage wildcard: strength",
                "K00Lguy team: does 173 damage",
                "Adam Strange: takes 58 damage",
                "Adam Strange: dies",
                "Agent Bob: takes 58 damage",
                "Agent Bob: dies",
                "Agent Zero: takes 58 damage"
            ]
        },
        {
            "damage": 94,
            "remarks": [
                "Damage wildcard: speed",
                "johndoe1 team: does 94 damage",
                "Abraxas: takes 31 damage",
                "Absorbing Man: takes 31 damage",
                "Adam Monroe: takes 31 damage"
            ]
        },
        {
            "damage": 134,
            "remarks": [
                "Damage wildcard: speed",
                "K00Lguy team: does 134 damage",
                "Adam Strange: takes 45 damage",
                "Agent Bob: takes 45 damage",
                "Agent Bob: dies",
                "Agent Zero: takes 45 damage"
            ]
        },
        {
            "damage": 52,
            "remarks": [
                "Damage wildcard: strength",
                "johndoe1 team: does 52 damage",
                "Abraxas: takes 17 damage",
                "Absorbing Man: takes 17 damage",
                "Adam Monroe: takes 17 damage"
            ]
        }
    ]
}