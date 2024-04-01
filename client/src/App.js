import logo from './logo.svg';
import Home from "./pages/Home";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import {useEffect, useState} from 'react';

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch("http://localhost:8000/auth/login/success", {
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
                    setUser(result.user);
                    setIsLoading(false);

                }
                else { 
                    // TODO: if have cookies -> remove cookies 
                    // ...
                    throw new Error("Authentication failed")
                }
            } catch (e) {
                console.log(e);
                setIsLoading(false);
            }
        }
        getUser();
    }, []);

    if (isLoading) {
        // TODO: better loading
        return <div>Loading...</div>;
    }

    console.log(user);

    return (
        <BrowserRouter>
            <div>
                <Navbar user={user}/>
                <Routes>
                    <Route path="/" 
                        element={<Home />} />
                    <Route path="/login" 
                        element={ user ? <Navigate to="/"/> : <Login/>} />
                    <Route path="/post/:id" 
                        element={user ? <Post/> : <Navigate to="/login"/>} />
                    <Route path="/generate-calendar" 
                        element={user ? <Calendar/> : <Navigate to="/login"/>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
