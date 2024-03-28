import React from 'react';
class Login extends React.Component {
    constructor() {
        super();
    }

    login() {
        window.open("http://localhost:8000/auth/google", "_self");
    }

    render() {
        return (
            <>
                <h1>DITME LOGIN LE COI</h1>
                <button onClick={() => this.login()}>LOGIN WITH GOOGLE</button>
            </>
        );
    }
}
export default Login;
