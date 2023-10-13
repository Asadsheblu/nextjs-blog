import Image from 'next/image';
import React from 'react';
import choose from "../../public/img/overview.jpg"
const Trust = () => {
    return (
        <div className="p-5">
            
        <div className="container">
            <div className="row">
                <div className="col-md-5">
                    <Image   src={choose} className="img-fluid" alt="choose" srcset=""/>
                </div>
                <div  data-aos="fade-up" className="col-md-7 p-5">
                    <h2>Why People Trust Us</h2>
                    <p className="pt-2">At Progressive, we are committed to finding the right coverage at the lowest
                        possible rate for each of our clients, both commercial and individual.</p>
                    <small>Our work does not end when a policy is issued; but rather, we work continuously to provide
                        you with personal assistance on any insurance needs you may have such as Certificates of
                        Insurance, Claims or Policy Changes.</small>
                    <div className="pt-3">
                        <button className="btn btn-primary ps-3 pe-3 pt-2 pb-2 fw-bold">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
  
        </div>
    );
};

export default Trust;