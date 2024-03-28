import React from 'react';
class Navbar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                <div>THIS IS A NAVBAR</div>
                {this.props.user 
                    ? (<div>User exist</div>) 
                    : (<div>User not exist</div>)}
            </>
        );
    }
}

export default Navbar;
