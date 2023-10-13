import React, {useState} from 'react'; 
import { ArrowUpCircle } from 'react-bootstrap-icons';

  
const ScrollButton = () =>{ 
  
  const [visible, setVisible] = useState(false) 
  
  const toggleVisible = () => { 
    const scrolled = document.documentElement.scrollTop; 
    if (scrolled > 300){ 
      setVisible(true) 
    }  
    else if (scrolled <= 300){ 
      setVisible(false) 
    } 
  }; 
  
  const scrollToTop = () =>{ 
    Window.scrollTo({ 
      top: 0,  
      behavior: 'smooth'
      /* you can also use 'auto' behaviour 
         in place of 'smooth' */
    }); 
  }; 
  
  Window.addEventListener('scroll', toggleVisible); 
  
  return ( 
    <button type="button" class="btn btn-primary" id="btn-back-to-top">
       <ArrowUpCircle className="text-white"/>
    </button>
  ); 
} 
  
export default ScrollButton; 