import React from 'react';
import { ArrowRight, EmojiSmileUpsideDown } from 'react-bootstrap-icons';
const Mission = () => {
    return (
     
        <div class="container">
            <div class="row mision p-5">
                <div  class="col-md-4 g-2">
                    <div class=" card shadow p-3">

                        <span class="icon">
                            <EmojiSmileUpsideDown className="fs-1"/>
                    
                        </span>

                        <h4 class="fw-bold pt-2">Peace Of Mind</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione incidunt dolor</p>
                    </div>
                </div>
                <div  class="col-md-4 g-2">
                    <div class=" card shadow p-3">

                        <span class="icon">
                        <EmojiSmileUpsideDown className="fs-1"/>
                        </span>

                        <h4 class="fw-bold pt-2">Set For Life</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione incidunt dolor</p>
                    </div>
                </div>
                <div  class="col-md-4 g-2">
                    <div class=" card shadow p-3">

                        <span class="icon">
                        <EmojiSmileUpsideDown className="fs-1"/>
                        </span>

                        <h4 class="fw-bold pt-2">100% Satisfiction</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ratione incidunt dolor</p>
                    </div>
                </div>
            </div>
        </div>
  
    );
};

export default Mission;