import React from 'react';
import { Award, CheckSquare, Clipboard2DataFill, PersonSquare } from 'react-bootstrap-icons';
import CountUp from 'react-countup';
const Counter = () => {
    return (
        <div className="pt-4 pb-4">
            <div className="container p-5 shadow rounded bg-light">
            <hr className="text-primary"/>
            <div className="row">
                <div className="col-md-3 ">
                    <div className="d-flex counter-card">
                        <div className="icon pt-3">
                            <Award className="fs-1 text-primary"/>
                           
                        </div>
                        <div className="ps-3">
                        <CountUp  className="purecounter  fs-1  text-black text-center fw-bold" end={100} />
                            
                            <p>International Award</p>
                        </div>
                    </div>

                </div>
                <div className="col-md-3 ">
                    <div className="d-flex counter-card">
                        <div className="icon pt-3">
                        <PersonSquare className="fs-1 text-primary"/>
                        </div>
                        <div className="ps-3">
                        <CountUp  className="purecounter  fs-1  text-black text-center fw-bold" end={866} />
                            <p>Satisfied Clients</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 ">
                    <div className="d-flex counter-card">
                        <div className="icon pt-3">
                        <CheckSquare className="fs-1 text-primary"/>
                        </div>
                        <div className="ps-3">
                        <CountUp  className="purecounter  fs-1  text-black text-center fw-bold" end={4563} />
                            <p>SuccessFul Insurance</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 ">
                    <div className="d-flex counter-card">
                        <div className="icon pt-3">
                        <Clipboard2DataFill className="fs-1 text-primary"/>
                        </div>
                        <div className="ps-3">
                        <CountUp  className="purecounter  fs-1  text-black text-center fw-bold" end={225} />
                            <p>Global Agents</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="text-primary"/>
        </div>
        </div>
    );
};

export default Counter;