import React from 'react';
import announce from '../public/shape/announce.png';
import chart from '../public/shape/chart (1).png';
import cloud from '../public/shape/cloud.png';
import cloud2 from '../public/shape/cloud2.png';
import Image from 'next/image';
const Banner = () => {
    return (
        <div>
          <Image className="shape1" src={announce} priority={true} alt="announce" />
          <Image className="shape2" src={cloud} priority={true} alt="announce" />
          <Image className="shape3" src={cloud2} priority={true} alt="announce" />
          <Image className="shape4" src={chart} priority={true} alt="announce" />
        </div>
    );
};

export default Banner;