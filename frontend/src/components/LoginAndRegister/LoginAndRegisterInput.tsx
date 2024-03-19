import React, {useState} from 'react'

function RegisterInput(props: any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    function handleSubmit(event: any) {
        event.preventDefault();
        props.registerUser(username, password)
    }
    function handleLogin(event: any) {
        event.preventDefault();
        props.loginUser(username, password)
    }

    return (
        <form>
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
            <button onClick={handleSubmit}>Register</button>
            <button onClick={handleLogin}>Login</button>
        </form>
    );
}

export default RegisterInput