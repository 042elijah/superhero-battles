import React, { useEffect, useState } from 'react';
import axios from "axios";
import { tryPromise, resToHero } from '../util/util';
import Team from './Team';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SALT_ROUNDS = 10;
const SECRET_KEY = 'your-secret-key';

const URL = `http://3.137.160.227:4000`;

function Battle() {
    // Since battle holds a lot of data, might need to separate it in different hooks (or else can cause flickering when only want one thing to change)
    // (Already saw this happen when including 'step' variable inside the same object as battle)
    const [battle, setBattle] = useState(null as any);
    // Need separate hook for step or else the whole state will get changed when only step changes and cause flickering (because whole screen re-renders at once)
    const [step, setStep] = useState(-2);

    const token = useSelector((state: any) => state.token.value);
    const username = useSelector((state: any) => state.token.username);
    const requestedBattle = useSelector((state: any) => state.requestedBattle);

    const [statIdx1, setStatIdx1] = useState(-1);
    const [statIdx2, setStatIdx2] = useState(-1);

    const [battleFinished, setBattleFinished] = useState(false);

    const startBattle = tryPromise(async (event: any) => {
        const battle = await simulateBattle();

        setBattle(battle);

        setStep(-1);
    });

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const stepLoop = () => {

        if (battle != null && !battle.code) {
            // If next step would bring the step index out of bounds, then the battle is has finished already
            if(step + 1 >= battle.steps.length) {
                setBattleFinished(true);
            }
            else if(!battleFinished) {
                delay(3000).then(() => setStep(step + 1));
            }
        }
    };

    const useBattleEffects = () => {
        // Used for looping through state steps with a delay
        useEffect(stepLoop, [step]);
    
        // Used for setting each team's state step BASED ON the whole battle's state step
        // ** Needs to be in a separate useEffect hook because it references battle state step to calc team's steps (if it is not in a useEffect, team's steps won't update) **
        useEffect(() => { if (battle != null && !battle.code && !battleFinished) { real_calculateTeamSteps(); } }, [step]);
    
        useEffect(() => { if(battle != null && !battle.code && (statIdx1 >= battle.steps.length || statIdx2 >= battle.steps.length)) { setBattleFinished(true) } }, [step, statIdx1, statIdx2]);
    };

    const hardcoded_calculateTeamSteps = () => {
        switch (step) {
            case -1:
                setStatIdx1(-1);
                setStatIdx2(-1);
                break;

            case 0:
                setStatIdx1(0);
                setStatIdx2(-1);
                break;

            case 1:
                setStatIdx1(0);
                setStatIdx2(1);
                break;

            case 2:
                setStatIdx1(0);
                setStatIdx2(2);
                break;

            case 3:
                setStatIdx1(3);
                setStatIdx2(2);
                break;

            case 4:
                setStatIdx1(3);
                setStatIdx2(4);
                break;

            case 5:
                setStatIdx1(5);
                setStatIdx2(4);
                break;
        }
    }

    const real_calculateTeamSteps = () => {
        if(battle && !battle.code) {
            if(statIdx1 < battle.steps.length && statIdx2 < battle.steps.length) {
                if (step == -1) {
                    // Show initial stats
                    console.log('Initial state');
                }
                // The first step is the challenger's stat bonus phase/step
                else if(step == 0) {
                    setStatIdx1(0);
                }
                // The second step is the opponent's stat bonus phase/step
                else if (step == 1) {
                    setStatIdx2(1);
                }
                // The rest of the steps follow a consistent pattern
                else {
                    if (step % 2 == 0) {
                        setStatIdx2(step);
                    }
                    else {
                        setStatIdx1(step);
                    }
                }
            }
        }
        else {
            console.log('Battle not made yet');
        }
    };

    const getTeamAnimClasses = (teamIdx: number) => {
        // Return an array of either '', 'bonus-anim', 'penalty-anim', or 'hit-anim'
        // based on teamIdx and current step value
        // for step == 0 or step == 1:
            // use battle.xStatBonuses.reduce to check if a particular hero got a bonus or a penalty and that decides bonus 

        // else for other steps:
            // just do step % 2 == 0
                // if its correct teamIdx
                    // then return hit-anim
                // else
                    // return ''

        const team = teamIdx == 0 ? battle.challengerTeam : battle.opponentTeam;
        let animClasses = [];

        for(let i = 0; i < team.length; i++) {
            if(battle != null) {
                animClasses.push(getHeroAnimClass(teamIdx, i));
            }
            else {
                return '';
            }
        }
        
        return animClasses;
    };

    const getHeroAnimClass = (teamIdx: number, heroIdx: number) => {
        if(step == teamIdx) {
            let type;
            try { type = (teamIdx == 0 ? battle.challengerStatBonuses : battle.opponentStatBonuses)[heroIdx].type; } catch(e){ return ''; }

            if(type == 'bonus') {
                return 'bonus-anim';
            }
            else if(type == 'penalty') {
                return 'penalty-anim';
            }
        }
        else if(step > 1 && step % 2 == (1 - teamIdx)) {
            return 'hit-anim';
        }
        
        return '';
    };

    const getTeamRemarks = (teamIdx: number) => {
        const emptyOfLen = (x: number) => { let a = []; for(let i = 0; i < x; i++) { a.push(''); } return a; }

        if(!battle) {
            return [];
        }

        if((step == 0 && teamIdx == step) || (step == 1 && teamIdx == step)|| (step > 1 && step % 2 == (1 - teamIdx))) {
            // return battle.steps[step].teamRemarks.reduce((all: any, r: any) => [...all, r.remark], []);

            let remarks = [...emptyOfLen(battle.steps[step].teamRemarks.length)];

            battle.steps[step].teamRemarks.forEach((r: any) => {
                remarks[r.heroIndex] = r.remark;
            });

            return remarks;
        }

        
        // return (teamIdx == 0 ? battle.challengerTeam : battle.opponentTeam).reduce((all: any, r: any) => [...all, r.remark], []);
        return [];
    }

    const getHideStyle = (x: boolean) => {
        return x == true ? 
        {} : 
        { color: 'transparent' };
    };

  /*
    idx1: -1 <Start with initial stats>
    idx2: -1 <Start with initial stats>

    idx1: 0  // = 0
    idx2: -1 // none

    idx1: 0  // none
    idx2: 1  // = 1
    // end of bonus phases

    idx1: 0  // none
    idx2: 2  // = 2

    idx1: 3  // = 3
    idx2: 2  // none

    idx1: 3  // none
    idx2: 4  // += 2

    idx1: 5  // += 2
    idx2: 4 // none

    ...
  */

    const simulateBattle = async () => {
        if(!requestedBattle || !requestedBattle.challenger) {
            return;
        }

        return await axios.post(`${URL}/battleground/battle`,
        requestedBattle
        // {
        //     "challenger": "K00Lguy",
        //     "challengerTeam": [-1, 8, 7],
        //     "opponent": "johndoe1",
        //     "opponentTeam": [8 , -1, 11]
        // }
        )
        .then(x => x.data)
        .catch(err => {
            console.error(err);
            return null;
        });
    };

    useBattleEffects();

    return (
        <div style={{margin: '0px 10px 0px 10px', transformOrigin: 'top left', transform: 'scale(var(--battle-view-scale))'}}>
            {/* <p>Battle state: {battleFinished === true ? "done" : (battleFinished === false ? "running" : "unknown")}</p> */}
            <p>{`Signed in as ${username ? username : 'guest'}`}</p>

            <>
                { requestedBattle && requestedBattle.challenger ? 
                <p>{`${requestedBattle.challenger} challenges ${requestedBattle.opponent} to battle!`}</p> :
                <p>No battle requested</p>}
            </>
        
        {
            requestedBattle && requestedBattle.challenger ?
            <button hidden={battle != null } onClick={startBattle}>Start battle!</button> :
            <Link className="nav-link" to={'/'} style={{ display: 'inline-block' }}>
                <button>Log in to battle!</button>
            </Link>
        }
        {/* <h1>{step}</h1> */}
        {/* <h3>{`idx1: ${statIdx1} / ${battle != null ? battle.steps.length - 1 : '?'}`}</h3> */}
        {/* <h3>{`idx2: ${statIdx2} / ${battle != null ? battle.steps.length - 1 : '?'}`}</h3> */}
        <>
            {battle != null ? (
                !battle.code ? 
            <>
                {/* <p>{
                    JSON.stringify(
                        battle.steps.map((s: any) => {
                            return s.teamStats.map((stats: any) => {
                                return {dur: stats.durability, heal: stats.currentHealth};
                            });
                    })
                    )
                }</p> */}
                {/* <p>{`${battle.challenger} challenges ${battle.opponent} to battle!`}</p> */}

                {/* <h3>{`${battle.challenger}'s team:`}</h3> */}
                <Team user={battle.challenger} team={battle.challengerTeam} targetLocation='above' teamRemarks={battle ? getTeamRemarks(0) : []} animClasses={getTeamAnimClasses(0)} teamStats={ statIdx1 >= 0 ? battle.steps[statIdx1]?.teamStats : null }/>
                
                <h2 style={{...getHideStyle(step >= 0 && step < battle.steps.length)}}>
                    { !battleFinished ?
                     step >= 0 && step < battle.steps.length ? battle.steps[step].globalRemarks[0] : '.' : 
                     `${step % 2 == 0 ? battle.challenger : battle.opponent} wins!` 
                    }
                    </h2>

                {/* <p>{`remarks: ${step >= 0 ? JSON.stringify(battle.steps[step]?.remarks) : "Not initialized"}`}</p> */}

                {/* <h3>{`${battle.opponent}'s team:`}</h3> */}
                <Team user={battle.opponent} team={battle.opponentTeam} targetLocation='below' teamRemarks={battle ? getTeamRemarks(1) : []} animClasses={getTeamAnimClasses(1)} teamStats={ statIdx2 >= 0 ? battle.steps[statIdx2]?.teamStats : null }/>
                {/* <Team team={battle.opponentTeam} teamStats={ battle.steps[2].teamStats }/> */}
            </>
            : <>{JSON.stringify(battle)}</>
            ) : <></>}
        </>
        </div>
    );
}

export default Battle




const b = {
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
/* Step 0 */ "damage": 0,
            "teamStats": [
                {
                    "intelligence": 101,
                    "strength": 72,
                    "speed": 95,
                    "durability": 115,
                    "currentHealth": 115
                },
                {
                    "intelligence": 43,
                    "strength": 92,
                    "speed": 28,
                    "durability": 115,
                    "currentHealth": 115
                },
                {
                    "intelligence": 54,
                    "strength": 9,
                    "speed": 11,
                    "durability": 85,
                    "currentHealth": 85
                }
            ],
            "remarks": [
                "Abraxas: 15% alignment bonus",
                "Absorbing Man: 15% alignment bonus",
                "Adam Monroe: 15% alignment penalty"
            ]
        },
        {
/* Step 1 */ "damage": 0,
            "teamStats": [
                {
                    "intelligence": 79,
                    "strength": 11,
                    "speed": 37,
                    "durability": 46,
                    "currentHealth": 46
                },
                {
                    "intelligence": 11,
                    "strength": 9,
                    "speed": 14,
                    "durability": 5,
                    "currentHealth": 5
                },
                {
                    "intelligence": 86,
                    "strength": 32,
                    "speed": 43,
                    "durability": 92,
                    "currentHealth": 92
                }
            ],
            "remarks": [
                "Adam Strange: 15% alignment bonus",
                "Agent Bob: 15% alignment bonus",
                "Agent Zero: 15% alignment bonus"
            ]
        },
        {
/* Step 2 */ "damage": 134,
            "teamStats": [
                {
                    "intelligence": 79,
                    "strength": 11,
                    "speed": 37,
                    "durability": 46,
                    "currentHealth": 1
                },
                {
                    "intelligence": 11,
                    "strength": 9,
                    "speed": 14,
                    "durability": 5,
                    "currentHealth": 0
                },
                {
                    "intelligence": 86,
                    "strength": 32,
                    "speed": 43,
                    "durability": 92,
                    "currentHealth": 47
                }
            ],
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
/* Step 3 */ "damage": 52,
            "teamStats": [
                {
                    "intelligence": 101,
                    "strength": 72,
                    "speed": 95,
                    "durability": 115,
                    "currentHealth": 98
                },
                {
                    "intelligence": 43,
                    "strength": 92,
                    "speed": 28,
                    "durability": 115,
                    "currentHealth": 98
                },
                {
                    "intelligence": 54,
                    "strength": 9,
                    "speed": 11,
                    "durability": 85,
                    "currentHealth": 68
                }
            ],
            "remarks": [
                "Damage wildcard: strength",
                "johndoe1 team: does 52 damage",
                "Abraxas: takes 17 damage",
                "Absorbing Man: takes 17 damage",
                "Adam Monroe: takes 17 damage"
            ]
        },
        {
/* Step 4 */ "damage": 198,
            "teamStats": [
                {
                    "intelligence": 79,
                    "strength": 11,
                    "speed": 37,
                    "durability": 46,
                    "currentHealth": 0
                },
                {
                    "intelligence": 11,
                    "strength": 9,
                    "speed": 14,
                    "durability": 5,
                    "currentHealth": 0
                },
                {
                    "intelligence": 86,
                    "strength": 32,
                    "speed": 43,
                    "durability": 92,
                    "currentHealth": 26
                }
            ],
            "remarks": [
                "Damage wildcard: intelligence",
                "K00Lguy team: does 198 damage",
                "Adam Strange: takes 66 damage",
                "Adam Strange: dies",
                "Agent Bob: takes 66 damage",
                "Agent Bob: dies",
                "Agent Zero: takes 66 damage"
            ]
        },
        {
/* Step 5 */ "damage": 94,
            "teamStats": [
                {
                    "intelligence": 101,
                    "strength": 72,
                    "speed": 95,
                    "durability": 115,
                    "currentHealth": 84
                },
                {
                    "intelligence": 43,
                    "strength": 92,
                    "speed": 28,
                    "durability": 115,
                    "currentHealth": 84
                },
                {
                    "intelligence": 54,
                    "strength": 9,
                    "speed": 11,
                    "durability": 85,
                    "currentHealth": 54
                }
            ],
            "remarks": [
                "Damage wildcard: speed",
                "johndoe1 team: does 94 damage",
                "Abraxas: takes 31 damage",
                "Absorbing Man: takes 31 damage",
                "Adam Monroe: takes 31 damage"
            ]
        },
        {
/* Step 6 */ "damage": 173,
            "teamStats": [
                {
                    "intelligence": 79,
                    "strength": 11,
                    "speed": 37,
                    "durability": 46,
                    "currentHealth": 0
                },
                {
                    "intelligence": 11,
                    "strength": 9,
                    "speed": 14,
                    "durability": 5,
                    "currentHealth": 0
                },
                {
                    "intelligence": 86,
                    "strength": 32,
                    "speed": 43,
                    "durability": 92,
                    "currentHealth": 34
                }
            ],
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
/* Step 7 */ "damage": 176,
            "teamStats": [
                {
                    "intelligence": 101,
                    "strength": 72,
                    "speed": 95,
                    "durability": 115,
                    "currentHealth": 56
                },
                {
                    "intelligence": 43,
                    "strength": 92,
                    "speed": 28,
                    "durability": 115,
                    "currentHealth": 56
                },
                {
                    "intelligence": 54,
                    "strength": 9,
                    "speed": 11,
                    "durability": 85,
                    "currentHealth": 26
                }
            ],
            "remarks": [
                "Damage wildcard: intelligence",
                "johndoe1 team: does 176 damage",
                "Abraxas: takes 59 damage",
                "Absorbing Man: takes 59 damage",
                "Adam Monroe: takes 59 damage"
            ]
        },
        {
/* Step 8 */ "damage": 173,
            "teamStats": [
                {
                    "intelligence": 79,
                    "strength": 11,
                    "speed": 37,
                    "durability": 46,
                    "currentHealth": 0
                },
                {
                    "intelligence": 11,
                    "strength": 9,
                    "speed": 14,
                    "durability": 5,
                    "currentHealth": 0
                },
                {
                    "intelligence": 86,
                    "strength": 32,
                    "speed": 43,
                    "durability": 92,
                    "currentHealth": 34
                }
            ],
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
/* Step 9 */ "damage": 94,
            "teamStats": [
                {
                    "intelligence": 101,
                    "strength": 72,
                    "speed": 95,
                    "durability": 115,
                    "currentHealth": 84
                },
                {
                    "intelligence": 43,
                    "strength": 92,
                    "speed": 28,
                    "durability": 115,
                    "currentHealth": 84
                },
                {
                    "intelligence": 54,
                    "strength": 9,
                    "speed": 11,
                    "durability": 85,
                    "currentHealth": 54
                }
            ],
            "remarks": [
                "Damage wildcard: speed",
                "johndoe1 team: does 94 damage",
                "Abraxas: takes 31 damage",
                "Absorbing Man: takes 31 damage",
                "Adam Monroe: takes 31 damage"
            ]
        },
        {
/* Step 10 */ "damage": 134,
            "teamStats": [
                {
                    "intelligence": 79,
                    "strength": 11,
                    "speed": 37,
                    "durability": 46,
                    "currentHealth": 1
                },
                {
                    "intelligence": 11,
                    "strength": 9,
                    "speed": 14,
                    "durability": 5,
                    "currentHealth": 0
                },
                {
                    "intelligence": 86,
                    "strength": 32,
                    "speed": 43,
                    "durability": 92,
                    "currentHealth": 47
                }
            ],
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
/* Step 11 */ "damage": 94,
            "teamStats": [
                {
                    "intelligence": 101,
                    "strength": 72,
                    "speed": 95,
                    "durability": 115,
                    "currentHealth": 84
                },
                {
                    "intelligence": 43,
                    "strength": 92,
                    "speed": 28,
                    "durability": 115,
                    "currentHealth": 84
                },
                {
                    "intelligence": 54,
                    "strength": 9,
                    "speed": 11,
                    "durability": 85,
                    "currentHealth": 54
                }
            ],
            "remarks": [
                "Damage wildcard: speed",
                "johndoe1 team: does 94 damage",
                "Abraxas: takes 31 damage",
                "Absorbing Man: takes 31 damage",
                "Adam Monroe: takes 31 damage"
            ]
        }
    ]
}


/*
step ; idx1 ; idx2
-1 ; -1 ; -1
0 ; -1 ; -1
1 ; -1 ; 0
2 ; 1 ; 0
3 ; 1 ; 2
4 ; 3 ; 2
5 ; 3 ; 4
6 ; 5 ; 4
*/