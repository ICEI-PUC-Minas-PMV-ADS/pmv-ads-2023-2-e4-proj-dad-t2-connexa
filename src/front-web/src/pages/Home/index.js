import React, { useState } from "react";
import "./styles.css";
import logo from "../../img/logo.png";

function Home() {
    return (
        <div className="home">
            <div className="home-container">
                <h2>Home</h2>
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </div>
    );
}

export default Home;
