import React, { useEffect, useState } from 'react'
import HeroCard from './HeroCard';
import Hero from '../model/hero';

function GetAllImgs() {
    const [heroes, setHeroes] = useState([] as Hero[]);
    const imageStart = 95;
    const numImages = 40;
    
    useEffect(() => {
        getHeroes();
    }, []);

    const getHeroes = async () => {
        let newHeroes: Hero[] = [];
        for(let i = imageStart; i < imageStart + numImages; i++) {
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '0px'
      }}>
        {heroes && heroes.map((x: Hero, idx: any) => {
            return <HeroCard key={x.id} hero={x} />
        })}
    </div>
  )
}

export default GetAllImgs