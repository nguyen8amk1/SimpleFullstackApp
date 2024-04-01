import React from 'react';
class Calendar extends React.Component {
    constructor() {
        super();
    }

    
    async componentDidMount() {
        // TODO: call api in here 
        try {
            const response = await fetch("http://localhost:8000/api/generate-calendar", {
                method: "GET", 
                credentials: "include", 
                headers: {
                    Accept: "application/json",
                    "Content-Type": 'application/json', 
                    "Access-Control-Allow-Credentials": true, 
                }
            }); 

            if(response.status == 200) {
                const result = await response.json();
                console.log("calendar ", result);

            }
            else throw new Error("Ditmesaigon");
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <>
                <h1>CALENDAR</h1>
            </>
        );
    }
}
export default Calendar;
