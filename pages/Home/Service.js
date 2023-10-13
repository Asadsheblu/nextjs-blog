import React from 'react';
import { Archive, Bookmark, PersonCheck } from 'react-bootstrap-icons';

const Service = () => {
    return (
        <div id="service" className="container-fluid">
        <h2 className="text-center headline fw-bold pt-5">Our Service</h2>
        <div className="container">
            <div className="row text-center  p-5">
                <div data-aos="fade-right" className="col-md-4 g-2">
                    <div className="p-3">
                        <Archive className="fs-1 text-primary"/>
                      
                        <h4 className="fw-bold pt-2">Peace Of Mind</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione incidunt dolor</p>
                    </div>
                </div>
                <div data-aos="fade-up" className="col-md-4 g-2">
                    <div className="p-3">
                       <Bookmark className="fs-1 text-primary"/>
                        <h4 className="fw-bold pt-2">Set For Life</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione incidunt dolor</p>
                    </div>
                </div>
                <div data-aos="fade-left" className="col-md-4 g-2">
                    <div className="p-3">
                    <PersonCheck className="fs-1 text-primary"/>
                        <h4 className="fw-bold pt-2">100% Satisfiction</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione incidunt dolor</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Service;