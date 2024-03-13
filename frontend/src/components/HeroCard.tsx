import React, { useEffect, useState } from 'react'

function HeroCard(props: any) {
    const [state, setState] = useState({ focused: false, gettingHit: false });

    const getTier = () => {
        if(!props.hero || !props.hero.id || !(
            props.hero.powerstats.intelligence && 
            props.hero.powerstats.strength && 
            props.hero.powerstats.speed && 
            props.hero.powerstats.durability)) {
                return -1;
        }

        let avg = 
        (props.hero.powerstats.intelligence +
        props.hero.powerstats.strength +
        props.hero.powerstats.speed +
        props.hero.powerstats.durability) / 4;

        // Diamond
        if(avg > 72) {
            return 3;
        // Gold
        } else if(avg > 60) {
            return 2;
        // Silver
        } else if(avg > 40) {
            return 1;
        // Bronze
        }else if(avg > 0) {
            return 0;
        // Invalid
        } else {
            return -1;
        }
    };

    const getTierName = () => {
        switch (getTier()) {
            // Bronze tier
            case 0:
                return 'bronze';

            // Silver tier
            case 1:
                return 'silver';

            // Gold tier
            case 2:
                return 'gold';

            // Diamond tier
            case 3:
                return 'diamond';

            //Invalid
            case -1:
            default:
                return 'invalid';
        }
    };

    const getTierNumeral = () => {
        switch (getTier()) {
            // Bronze tier
            case 0:
                return 'I';

            // Silver tier
            case 1:
                return 'II';

            // Gold tier
            case 2:
                return 'III';

            // Diamond tier
            case 3:
                return 'IV';

            //Invalid
            case -1:
            default:
                return '';
        }
    };

    const tierColor = () => {
        // if(!(props.hero && 
        //     Number(props.hero.powerstats.intelligence) && 
        //     Number(props.hero.powerstats.strength) && 
        //     Number(props.hero.powerstats.speed) && 
        //     Number(props.hero.powerstats.durability))) {
        //         return 'transparent';
        //     }
        // let avg = 
        // (Number(props.hero.powerstats.intelligence) +
        // Number(props.hero.powerstats.strength) +
        // Number(props.hero.powerstats.speed) +
        // Number(props.hero.powerstats.durability)) / 4;
        
        // // Diamond tier
        // if(avg >= 72) {
        //     return 'rgb(146, 237, 255)';
        // }
        // // Gold tier
        // else if(avg >= 60) {
        //     return 'rgb(240, 176, 13)';
        // }
        // // Silver tier
        // else if(avg >= 40) {
        //     return 'rgb(160, 160, 160)';
        // }
        // // Bronze tier
        // else {
        //     // return 'rgb(205, 127, 50)';
        //     return 'rgb(181, 140, 78)';
        // }

        switch (getTier()) {
            // Bronze tier
            case 0:
                return 'rgb(181, 140, 78)';

            // Silver tier
            case 1:
                return 'rgb(160, 160, 160)';

            // Gold tier
            case 2:
                return 'rgb(240, 176, 13)';

            // Diamond tier
            case 3:
                return 'rgb(146, 237, 255)';

            //Invalid
            case -1:
            default:
                return 'transparent';
        }
    };

    const onClickEvent = (event: any) => {
        setState({ ...state, focused: !state.focused });
    };

    const alignmentColor = () => {
        // return props.hero.biography.alignment == 'good' ? 'green' : 'red';
        // return props.hero.biography.alignment == 'good' ? 'rgb(3, 98, 227)' : 'rgb(234, 41, 37)';
        // return props.hero.biography.alignment == 'good' ? 'rgb(13, 185, 36)' : 'rgb(234, 41, 37)';

        switch(props.hero.biography.alignment) {
            case 'good':
                return 'rgb(13, 185, 36)';
            case 'bad':
                return 'rgb(234, 41, 37)';
            // Some heroes are neutral
            case 'neutral':
            default:
                return 'darkgray';
        }
    };

    const animHitClass = () => {
        return state.gettingHit ? 'hit-anim' : '';
    };

    const getHitEvent = (event: any) => {
        setState({ ...state, gettingHit: true });
        props.hero.takeDamage(35.5);
    };

    const onAnimationEndEvent = (event: any) => {
        setState({ ...state, gettingHit: false });
    };

    // Use this in style if want shadow to be colored as the alignment color:
    // boxShadow: `15px 15px 10px 5px color-mix(in srgb, ${alignmentColor()} 35%, white)`

    return (
        <div className={`hero-card ${animHitClass()}`} 
            onClick={getHitEvent} 
            onAnimationEnd={onAnimationEndEvent}
        >
            {/* Hero image */}
            <img className='hero-card-image prevent-select' draggable='false' key={`image_${props.hero.id}`} src={props.hero.image.url}
            style={{borderColor: `${alignmentColor()}`, outlineColor: `${tierColor()}`}}/>
            
            {/* Card frame */}
            <img  className='hero-card-overlay prevent-select' src={require(`../img/${getTierName()}_frame.png`)}></img>

            {/* Stats */}
            <div className='stats-container'>
                    <p key={`para_${props.hero.id}`} draggable='false' className='hero-name prevent-select '>{props.hero.name}</p>
                    <div className='statdiv' style={{left:'17%'}}><p className='hero-stat prevent-select' draggable='false'>{props.hero.powerstats.intelligence}</p></div>
                    <div className='statdiv' style={{left:'38%'}}><p className='hero-stat prevent-select' draggable='false'>{props.hero.powerstats.strength}</p></div>
                    <div className='statdiv' style={{left:'62%'}}><p className='hero-stat prevent-select' draggable='false'>{props.hero.powerstats.speed}</p></div>
                    <div className='statdiv' style={{left:'84%'}}><p className='hero-stat prevent-select' draggable='false'>{props.hero.health}</p></div>
            </div>

            {/* Dead hero slash */}
            <img  className='hero-card-overlay prevent-select' hidden={props.hero.health <= 0 ? false : true } src={require('../img/red_x.png')}></img>
        </div>
    )
}

export default HeroCard