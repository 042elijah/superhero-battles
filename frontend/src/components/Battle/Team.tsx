import React from 'react'
import HeroCard from '../HeroCard';
import { resToHero } from '../util/util';

function Team(props: any) {
    const rowGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '0px'
    };

    const colGridStyle = {
        display: 'grid',
        // gridTemplateRows: 'repeat(8, 1fr)',
        gridTemplateRows: props.targetLocation == 'above' ? '450px 1fr' : '1fr 450px',
        gap: '0px'
    };

    const getHideStyle = (x: boolean) => {
        return x == true ? 
        {} : 
        { color: 'transparent' };
    };

    const applyStatsToTeam = () => {
        let t: any[] = [];
        for(let i = 0; i < props.team.length; i++) {
            // const hero = { ...props.team[i], powerstats: props.teamStats[i] };
            let hero = { ...props.team[i] };

            // If teamStats are provided, overwrite the heroes's stats with them, else just use the starting hero stats
            if(props.teamStats != null) {
                hero = { ...hero, powerstats: {...props.teamStats[i]} };
            }

            t.push(hero);
        }

        return t;
    };

    let team = applyStatsToTeam();

    const Remarks = (props: any) => {
        return (
            // <p hidden={props.hidden} style={{ marginTop: '0px', marginBottom: '0px', fontSize: '20px', /*backgroundColor: 'red',*/ textAlign: 'center' }}>{props.children}</p>
            <p hidden={props.hidden} style={{ ...props.hideStyle, marginTop: '0px', marginBottom: '0px', fontSize: '20px', /*backgroundColor: 'red',*/ textAlign: 'center' }}>{props.children}</p>
        )
    };

    const User = (subProps: any) => {
        return (
            <h3 hidden={subProps.hidden}>{props.user}</h3>
        )
    };

    return (
        <>
            <User hidden={props.targetLocation != 'below'}></User>
            <div style={rowGridStyle}>
                {(team as string[]).map((x: any, idx: any) => {
                    // return <p key={x}>{x.name}</p>
                    return (
                        <div key={`teamSlot_${x.name}`} style={colGridStyle}>
                            <Remarks hidden={props.targetLocation != 'below'} hideStyle={getHideStyle(Boolean(props.teamRemarks && props.teamRemarks[idx]))}>{ props.teamRemarks && props.teamRemarks[idx] ? props.teamRemarks[idx] : '.' }</Remarks>
                            <HeroCard hero={{ ...resToHero(x) }} animClass={props.animClasses[idx]} />
                            <Remarks hidden={props.targetLocation != 'above'} hideStyle={getHideStyle(Boolean(props.teamRemarks && props.teamRemarks[idx]))}>{ props.teamRemarks && props.teamRemarks[idx] ? props.teamRemarks[idx] : '.' }</Remarks>
                        </div>

                    );
                })}
            </div>
            <User hidden={props.targetLocation != 'above'}></User>
        </>

    )
}

export default Team


/*

Abraxas: 115HP
Absorbing Man: 115HP
Adam Monroe: 85HP

Abraxas: 115HP
Absorbing Man: 115HP
Adam Monroe: 85HP

Abraxas: 115HP
Absorbing Man: 115HP
Adam Monroe: 85HP

Abraxas: 115HP
Absorbing Man: 115HP
Adam Monroe: 85HP

Adam Strange: 46HP
Agent Bob: 5HP
Agent Zero: 92HP

Adam Strange: 46HP
Agent Bob: 5HP
Agent Zero: 92HP

Abraxas: 115HP
Absorbing Man: 115HP
Adam Monroe: 85HP

Abraxas: 115HP
Absorbing Man: 115HP
Adam Monroe: 85HP

Adam Strange: 1HP
Agent Bob: 0HP
Agent Zero: 47HP

Adam Strange: 1HP
Agent Bob: 0HP
Agent Zero: 47HP

Abraxas: 56HP
Absorbing Man: 56HP
Adam Monroe: 26HP

Abraxas: 56HP
Absorbing Man: 56HP
Adam Monroe: 26HP

Adam Strange: 1HP
Agent Bob: 0HP
Agent Zero: 47HP

Adam Strange: 1HP
Agent Bob: 0HP
Agent Zero: 47HP

*/