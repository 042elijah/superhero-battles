import React, {useState} from 'react'

function RegisterInput(props: any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event: any) {
        event.preventDefault();
        props.registerUser(username, password)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
            <button type="reset">Reset</button>
        </form>
    );
}

export default RegisterInput