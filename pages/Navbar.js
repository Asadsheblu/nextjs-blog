import React from 'react';

const Navbar = () => {
    return (
        <div classNameName='container'>

   
<nav id="mynav" className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand headline fs-3 ps-3" href="#">AsaTem</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-uppercase">
                    <li className="nav-item">
                        <a className="nav-link text-white" aria-current="page" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" aria-current="page" href="#about">About Us</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link text-white" aria-current="page" href="#service">Services</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" aria-current="page" href="#review">Client Say</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" aria-current="page" href="#Faq">Faq</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" aria-current="page" href="#contact">Contact Us</a>
                    </li>

                </ul>
                <button className="btn btn-outline-primary text-white">Become a member</button>
            </div>
        </div>
    </nav>
      </div>
    );
};

export default Navbar;