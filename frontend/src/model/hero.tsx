export default class hero {
    id: number;
    name: string;

    health: number;

    image: {
        url: string;
    }
    powerstats: {
        intelligence: number;
        strength: number;
        speed: number;
        durability: number;
    }
    biography: {
        alignment: string;
    }

    constructor({ id, name, image, powerstats, biography } : { id: number, name: string, image: { url: string }, powerstats: { intelligence: number, strength: number, speed: number, durability: number }, biography: { alignment: string} }) {
        this.id = id;
        this.name = name;
        this.health = powerstats.durability; // Initial health is the hero's durability
        this.image = image;
        this.powerstats = powerstats;
        this.biography = biography;
    }

    public takeDamage(damage: number): any {
        this.health -= damage;

        // Decimals don't display well on the cards, so we will round down to get rid of them
        this.health = Math.floor(this.health);

        if(this.health <= 0) {
            this.health = 0;
            this.die();
        }
    };

    die() {

    }
}