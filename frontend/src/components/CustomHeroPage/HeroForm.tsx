import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';


export default function HeroForm() { //default values for hero

    const [formData, setFormData] = useState({ heroName: "", alignment: "", description: "", backstory: "", stats: 0, avatar: 0 });

    const token = useSelector((auth: any) => auth.token.value);
    
    const { username } = useParams(); //gets the username out of /users/:username/customhero


    useEffect(() => { //initializes formData to be the user's hero
        getCustomHero((username as string) ? username as string : '') //get custom hero data from db
        .then(response => { 
            setFormData((prevFormData) => ({ ...prevFormData, ...response }));
        });
    }, []);

    async function getCustomHero(username: string) { //retrieves the customHero associated with the user in /users/:username/customhero
        try {

            if( !username ) { //verify we actually have a username
                return null;
            }

            let response = await axios.get(`http://localhost:4000/users/${username}/customhero`);

            if ( response && response.data ) //verify we got a response
                return response.data.data.data; //is this for real? why the hell did i make it like this
            else
                return null;

        } catch (error) {
            console.error(`ERROR!: ${error}`);
        }        
    };

    const handleChange = (event: any) => { //updates formData hook when a form input is changed

        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };


    const handleSubmit = (event: any) => { //submits new formData to DAO on pressing of submit button

        event.preventDefault();
        putCustomHero({ ...formData })
        .then(response => {
            console.log(`REGISTER RESPONSE: ${response}`);
        });
    };

    async function putCustomHero(data: any) {
        
        try {
            console.log(` REGISTER: ${JSON.stringify(data)}`);

            let response = await axios.put(`http://localhost:4000/users/${username}/customization`, { 
                headers: {
                    Authorization: `Bearer ${token}` //puts token in the headers
                },
                data 
            });

            return response;

        } catch (error) {
            console.error(`ERROR!: ${error}`);
        }

    }


   if(token) { //how do we tell if we're logged in?
        return (
            <form onSubmit={handleSubmit}>

                <HeroAvatar id={formData.avatar}/>
                
                <label htmlFor="avatar">Avatar ID:</label>
                <input type="number" min="0" max="6" id="avatar" name="avatar" value={formData.avatar} onChange={handleChange}/>

                <UserLink username={username}/>

                <label htmlFor="heroName">Name:</label>
                <input type="text" id="heroName" name="heroName" placeholder="Your hero's name" value={formData.heroName} onChange={handleChange}/>

                <label htmlFor="alignment">
                    Alignment:
                    <select id="alignment" name="alignment" value={formData.alignment} onChange={handleChange}>
                        <option value="good">Good</option>
                        <option value="bad">Bad</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </label>

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" placeholder="Description of your hero" value={formData.description} onChange={handleChange}/>

                <label htmlFor="backstory">Backstory:</label>
                <textarea id="backstory" name="backstory" placeholder="Your hero's backstory" value={formData.backstory} onChange={handleChange}/>

                <label htmlFor="stats">Stats ID:</label>
                <input type="number" min="1" max="731" id="stats" name="stats" value={formData.stats} onChange={handleChange}/>

                <button type="submit">Submit</button>
            </form>
        );
    }
    else {
        return (
            <div>
                <h1 id="heroName"> Name: {formData.heroName} </h1>
                <HeroAvatar id={formData.avatar}/>
                <UserLink username={username}/>
                <p id="alignment"> Moral alignment: {formData.alignment} </p>
                <p id="description"> Description: {formData.description} </p>
                <p id="backstory"> Backstory: {formData.backstory} </p>
                <p id="stats"> Stats: {formData.stats} </p>
            </div>
        );
    }
}


function HeroAvatar({id = 0}) {

    let path = require(`../../img/hero-avatars/hero_${id}.png`);

    return (
        <div>
            <img id="heroAvatar" alt="Custom Superhero Avatar" style={{width:"500px", height:"500px"}} src={path} />
        </div>
    );
}

function UserLink({username=""}) {

    let path = `http://localhost:3000/users/${username}`;

    return (
        <Link className="nav-link" to={path}>
            Created by {username}
        </Link>
    );
}