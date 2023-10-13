import Image from 'next/image';
import React from 'react';
import { StarFill, StarHalf } from 'react-bootstrap-icons';

import Slider from "react-slick"
import avatarMale from "../../public/img/img_avatar.png"
import avatarFemale from "../../public/img/img_avatar2.png"
const Review = () => {
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
    
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: false,
              dots: true,
            },
          },
        ],
      };
    return (
        <div id="review" className="container-fluid bg-light">

        <h2 className="text-center headline fw-bold p-3">Our Client's Say</h2>
       
        <div className=" pb-5 container">
          
                
                <Slider {...sliderSettings}>
                    <div className="shadow rounded bg-white text-center p-4">
                        <div className="text-center">
                           
                            <Image src={avatarMale} className="w-25 h-25 client-img" alt="client-img"/>
                        </div>
                        <div className="pt-3 text-center">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, sint!</p>
                            <div className="text-warning">
                            <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                            </div>
                            <div className="pt-2 fw-bold">
                                <i className="bi bi-dash"></i>
                                <span>John Smith</span>
                            </div>
                        </div>
                    </div>
                    <div className="shadow rounded   bg-white  text-center p-4">
                        <div className="text-center">
                            <Image src={avatarFemale}className="w-25 h-25 client-img" alt="client-img"/>
                        </div>
                        <div className="pt-3 text-center">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, sint!</p>
                            <div className="text-warning">
                            <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                            </div>
                            <div className="pt-2 fw-bold">
                                <i className="bi bi-dash"></i>
                                <span>Arita Saha</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="shadow rounded bg-white  text-center p-4">
                        <div className="text-center">
                            <Image src={avatarMale} className="w-25 h-25 client-img" alt="client-img"/>
                        </div>
                        <div className="pt-3 text-center">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, sint!</p>
                            <div className="text-warning">
                            <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                            </div>
                            <div className="pt-2 fw-bold">
                                <i className="bi bi-dash"></i>
                                <span>David watson</span>
                            </div>
                        </div>
                    </div>
                    <div className="shadow rounded bg-white text-center p-4">
                        <div className="text-center">
                            <Image src={avatarFemale} className="w-25 h-25 client-img" alt="client-img" />
                        </div>
                        <div className="pt-3 text-center">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, sint!</p>
                            <div className="text-warning">
                            <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                            </div>
                            <div className="pt-2 fw-bold">
                                <i className="bi bi-dash"></i>
                                <span>Alegabeth Dues</span>
                            </div>
                        </div>
                    </div>
                    <div className="shadow rounded bg-white text-center p-4">
                        <div className="text-center">
                            <Image src={avatarMale} className="w-25 h-25 client-img" alt="client-img" />
                        </div>
                        <div className="pt-3 text-center">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, sint!</p>
                            <div className="text-warning">
                            <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                            </div>
                            <div className="pt-2 fw-bold">
                                <i className="bi bi-dash"></i>
                                <span>Nure Tapos</span>
                            </div>
                        </div>
                    </div>
                    <div className="shadow rounded bg-white  text-center p-4">
                        <div className="text-center">
                            <Image src={avatarFemale} className="w-25 h-25 client-img" alt="client-img" />
                        </div>
                        <div className="pt-3 text-center">
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, sint!</p>
                            <div className="text-warning">
                            <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                            </div>
                            <div className="pt-2 fw-bold">
                                <i className="bi bi-dash"></i>
                                <span>Anuska Sharma</span>
                            </div>
                        </div>
                    </div>
                    </Slider>
                  
                   
                
                

                </div>


            </div>
   
    );
};

export default Review;