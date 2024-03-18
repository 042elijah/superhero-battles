export default class Hero {
    id: number;
    name: string;

    // health: number;

    image: {
        url: string;
    }
    powerstats: powerstats;
    biography: {
        alignment: string;
    }

    constructor({ id, name, image, powerstats, biography } : hero) {
        this.id = id;
        this.name = name;
        // this.health = powerstats.durability; // Initial health is the hero's durability
        this.image = image;
        this.powerstats = powerstats as { intelligence: number; strength: number; speed: number; durability: number; currentHealth: number; };

        if(typeof powerstats.currentHealth !== 'undefined') {
            this.powerstats.currentHealth = powerstats.currentHealth;
        }
        else {
            this.powerstats.currentHealth = powerstats.durability;
        }
        this.biography = biography;
    }

    public takeDamage(damage: number): any {
        // this.health -= damage;
        if(typeof this.powerstats.currentHealth !== 'undefined') {
            this.powerstats.currentHealth -= damage;
        }

        // Decimals don't display well on the cards, so we will round down to get rid of them
        // this.health = Math.floor(this.health);
        if(typeof this.powerstats.currentHealth !== 'undefined') {
            this.powerstats.currentHealth = Math.floor(this.powerstats.currentHealth);
        }

        // if(this.health <= 0) {
        if(typeof this.powerstats.currentHealth !== 'undefined' && this.powerstats.currentHealth <= 0) {
            // this.health = 0;
            this.powerstats.currentHealth = 0;
            this.die();
        }
    };

    die() {

    }
}

interface hero {
    id: number;
    name: string;
    image: { url: string };
    powerstats: powerstats;
    biography: { alignment: string};
}

interface powerstats {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    // currentHealth: number;
    currentHealth?: number;
}