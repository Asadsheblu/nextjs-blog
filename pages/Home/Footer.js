import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'react-bootstrap-icons';

const Footer = () => {
    return (
        <div id="footer" className="container-fluid bg-dark">
        <div className="container">
            <div className="row">
                <div className="col-md-3 pt-5 text-white">

                    <h4 className=" text-primary headline">AsaTem</h4>


                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos exercitationem ratione
                        voluptatibus possimus culpa illo quia alias inventore, animi mollitia, repellat beatae modi
                        facere accusantium!</p>

                </div>
                <div className="col-md-3 p-5 text-white">
                    <h4 className="">Menu</h4>
                    <ul className="text-white">
                        <li><a href="#about" className="text-decoration-none text-white">About Us</a></li>
                        <li><a href="#service" className="text-decoration-none text-white">Services</a> </li>
                        <li><a href="#gallery" className="text-decoration-none text-white">Protfolio</a> </li>
                        <li><a href="#contact" className="text-decoration-none text-white">Contact</a></li>
                    </ul>
                </div>
                <div className="col-md-3 p-5 text-white">
                    <h4 className="">Contact Us</h4>
                    <div className="d-flex">
                        <i className="bi bi-telephone"></i>
                        <p className="ps-3">(111) 222 3562</p>
                    </div>

                    <div className="d-flex">
                        <i className="bi bi-envelope"></i>
                        <p className="ps-3">Yourmail@gmail.com</p>
                    </div>

                    <div className="d-flex ">
                        <i className="bi bi-geo-alt"></i>
                        <p className="ps-3">3225 N Harbar </p>
                    </div>


                </div>

                <div className="col-md-3 pt-5">
                    <h4 className="text-white">Follow Us</h4>
                    <div className="tips py-3">
                        <a href="#" className="bi bi-facebook bi-box"><Facebook/></a>
                        <a href="#" className="bi bi-twitter bi-box"><Twitter/></a>
                        <a href="#" className="bi bi-youtube bi-box"><Youtube/></a>
                        <a href="#" className="bi bi-instagram bi-box"><Instagram/></a>


                    </div>
                </div>
                <h6 className="text-center text-primary fw-bold title-text">© 2023 areban.com</h6>

            </div>
        </div>
    </div>
    );
};

export default Footer;