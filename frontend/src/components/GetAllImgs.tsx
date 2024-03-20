import React, { useEffect, useState } from 'react'
import HeroCard from './HeroCard';
import Hero from '../model/hero';

function GetAllImgs() {
    const [heroes, setHeroes] = useState([] as Hero[]);
    const imageStart = 270;
    const numImages = 30;
    // const imageStart = Math.floor(Math.random() * );
    // const numImages = 40;
    
    const getRandomArray = (min: number, max: number, len: number) => {
        let arr: number[] = [];

        for(let i = 0; i < len; i++) {
            const x = Math.floor(Math.random() * (max - min) + min);

            if(arr.includes(x)) {
                i--;
                continue;
            }

            arr.push(x);
        }

        return arr;
    };

    useEffect(() => {
        getHeroes();
    }, []);

    const getHeroes = async () => {

        const randomIds = getRandomArray(0, 567, 20);

        let newHeroes: Hero[] = [];
        // for(let i = imageStart; i < imageStart + numImages; i++) {
        for(let i of randomIds) {
            const url = `https://www.superheroapi.com/api.php/122100753632232992/${i}`;
            
            await fetch(url)
                .then(res => res.json())
                .then((x: any) => {
                    let h: Hero = new Hero({
                        id: x.id,
                        name: x.name,
                        image: {
                            url: x.image.url
                        },
                        powerstats: {
                            intelligence: Number(x.powerstats.intelligence),
                            strength: Number(x.powerstats.strength),
                            speed: Number(x.powerstats.speed),
                            durability: Number(x.powerstats.durability),
                            currentHealth: Number(x.powerstats.durability),
                        },
                        biography: {
                            alignment: x.biography.alignment
                        }
                    });

                    if(h && 
                        h.powerstats.intelligence && 
                        h.powerstats.strength && 
                        h.powerstats.speed && 
                        h.powerstats.durability) {
                        newHeroes.push(h);
                    }
                })
                .catch(console.error);
        }

        setHeroes(newHeroes);
    };

    return (
        <>
        <p style={{marginLeft: '10px'}}>Here are some heroes from the <a href='https://superheroapi.com/'>SuperHero API</a></p>

        {!heroes || heroes.length == 0 ?
            <p style={{fontSize: '30px'}}>Loading heroes...</p>
            :
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '0px'
            }}>
                {heroes && heroes.map((x: Hero, idx: any) => {
                    return <HeroCard key={x.id} hero={x} />
                })}
            </div>}
        </>
    )
}

export default GetAllImgs