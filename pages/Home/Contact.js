import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'react-bootstrap-icons';

const Contact = () => {
    return (
        <div id="contact" className="contact-area div-padding p-5">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-12">


                    <h2 className="headline text-center fw-bold">Contact us</h2>

                </div>
            </div>
            <div className="row pt-5">
                <div  data-aos="fade-right" className="col-lg-5 col-md-12">
                    <div className="row contact-information">

                        <div className="col-lg-12 col-md-12 col-sm-12 pt-5">
                            <div className="contact-details">
                                <h6 className="fw-bold">Phone:</h6>
                                <p>+05 773 325 777</p>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 pt-3">
                            <div className="contact-details">
                                <h6 className="fw-bold">Email:</h6>
                                <p>demo@example.com</p>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 pt-3">
                            <div className="contact-details">
                                <h6 className="fw-bold">Address:</h6>
                                <p>Beechwood Avenue - NY 55311, New York</p>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="box-social-media">
                                <a href="#"><Facebook/></a>
                                <a href="#"><Twitter/></a>
                                <a href="#"><Instagram/></a>
                                <a href="#"><Linkedin/></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div  data-aos="fade-left" className="col-lg-7 col-md-12">
                    <p className="form-message"></p><br />
                    <form className="contact-form form" id="contact-for">
                        <div className="controls">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <input id="form_name" type="text" name="name" placeholder="Your Name"
                                            required="required" />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 pt-3">
                                    <div className="form-group">
                                        <input id="form_email" type="email" name="email" placeholder="Your Email"
                                            required="required" />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 pt-3">
                                    <div className="form-group">
                                        <input id="form_subject" type="text" name="subject" placeholder="Your Subject"
                                            required="required" />
                                    </div>
                                </div>
                                <div className="col-md-12 pt-3">
                                    <div className="form-group">
                                        <textarea id="form_message" name="message" placeholder="Your Message" rows="4"
                                            required="required"></textarea>
                                    </div>
                                </div>
                                <div className="col-md-12 pt-2">
                                    <button type="submit" className="button ">Send Message</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Contact;