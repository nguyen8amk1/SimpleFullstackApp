import React from 'react';

class Navbar extends React.Component {
    constructor() {
        super();
    }

    logout() {
        window.open("http://localhost:8000/auth/logout", "_self");
    }

    render() {
        return (
            <>
                <div>THIS IS A NAVBAR</div>
                {this.props.user 
                    ? (<>
                        <div>User exist</div>
                        <button onClick={() => this.logout()}>LOGOUT</button>
                        </>) 
                    : (<div>User not exist</div>)}
            </>
        );
    }
}

export default Navbar;
