import Image from 'next/image';
import React from 'react';
import shape from "../../public/img/hero-shape-bottom.png"
const Banner = () => {
    return (
        <section id="hero" className="home-area  align-items-center">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-8 offset-lg-2 col-md-12">
                    <div className="text-center home-content z-index position-relative">
                        <h1 className="">
                            
                            <span data-aos="fade-right">
                                <b>Life More Relax With</b>

                            </span>
                            <br/>
                            <span data-aos="fade-up">
                                <b>Smart Insurance</b>
                            </span>
                        </h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, nostrud consectetur adipiscing elit.
                        </p>
                        <div className="home-button-box">
                            <button className="btn btn-primary">Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="svg-shape-bottom">
            <Image src={shape} className="bottom-shape img-fluid" alt=""/>
        </div>
    </section>
    );
};

export default Banner;