
import Image from 'next/image';
import React from 'react';
import about from "../../public/img/about.jpg"

const About = () => {
  
    return (
        <div id="about" class="p-5 bg-light container-fluid">
        <h2 class="text-center fw-bold headline p-3">About Us</h2>
        <div class="container">
            <div class="row">
                <div data-aos="fade-right" class="col-md-6">
                    <Image src={about} class="img-fluid" alt="about" srcset=""/>
                </div>
                <div data-aos="fade-up" class="col-md-6   pt-5">
                    <h2 class="fw-bold">Welcome to AsaTem</h2>
                    <p>Before <span class="fw-bold text-primary">AsaTem</span>, we worked in the insurance industry just
                        like you. We noticed that agencies were
                        struggling to keep up with the pace of change, especially when it comes to websites, digital
                        marketing, and other tech. So, in 2004, we set out to change that.</p>
                    <p>Over the years, we’ve pioneered the industry’s most innovative and powerful sales tools,
                        including Clickable Coverage, Hello Producer, Power Panels, and more. But we’re still just
                        getting started.</p>
                </div>
            </div>
        </div>
    </div>
    );
};

export default About;