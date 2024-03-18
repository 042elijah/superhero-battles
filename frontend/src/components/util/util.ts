import Hero from "../../model/hero";

/** From sgjennings's Reddit answer: 
 * (https://www.reddit.com/r/reactjs/comments/tadkr8/comment/i0084xr/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
 * 
 * How to use:
const onClick = tryPromise(async (event: MouseEvent) => {
// ...
})
return <button onClick={onClick}>Test</button>
 */
function tryPromise<A extends any[]>(p: (...args: A) => Promise<void>): (...args: A) => void {
    return (...args: A) => {
        try {
            p(...args).catch(err => console.log("Error thrown asynchronously", err));
        } catch (err) {
            console.log("Error thrown synchronously", err);
        }
    }
}

/**
 * Converts superheroapi response to a hero object
 */
function resToHero(res: any) {
    try {
        let h = new Hero({
            id: res.id,
            name: res.name,
            image: {
                url: res.image.url
            },
            powerstats: {
                intelligence: Number(res.powerstats.intelligence),
                strength: Number(res.powerstats.strength),
                speed: Number(res.powerstats.speed),
                durability: Number(res.powerstats.durability),
                currentHealth: Number(res.powerstats.currentHealth)
            },
            biography: {
                alignment: res.biography.alignment
            }
        });

        return h;
    }
    catch (error) {
        console.error('Malformed hero object');
    }

    return null;
}

export {
    tryPromise,
    resToHero
};