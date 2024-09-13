import React, { useState } from "react";
import IMAGES from "../images";

const Footer = () => {
    function handleclick () {
        console.log("in handle redirect")
        window.open("https://www.instagram.com/wodproleague/");
      };

      const [text, setText] = useState("hh")


  return (
    <div className="bg-black flex flex-col py-2 gap-2 items-center justify-center pb-14">
 {/* <div className='bg-[#0000FF] p-3 cursor-pointer' onClick={() => {
            setText("abb")
            console.log("in handle click")
          }} >
           {text}
        </div> */}
      <div className="flex items-center justify-center gap-4">
        <p className="text-white">Siga con nosotros</p>
        {/* <div className="flex gap-4"> */}
          {/* Uncomment and update the link if needed */}
          {/* <a href="https://www.tiktok.com/@wod.pro.league" target='_blank'>
            <img src={IMAGES.Tiktok} alt='Menu' className='h-10 w-10' />
          </a> */}
          {/* <div className="bg-white h-20 w-20" onClick={() => handleRedirect()}></div> */}
         
          {/* <Button onClick={() => {
            console.log("in handle click")
          }} className="bg-[#0000FF] p-3"> */}
            <img
              src={IMAGES.Insta}
              alt="Instagram"
              className="h-10 w-10 cursor-pointer"
            />
          {/* </Button> */}

          {/* Uncomment and update the links if needed */}
          {/* <img src={IMAGES.Youtube} alt='Menu' className='h-10 w-10' />
          <img src={IMAGES.Facebook} alt='Menu' className='h-10 w-10' /> */}
        {/* </div> */}
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-white text-[13px]">Contáctanos por correo electrónico: <a href="mailto:info@wodproleague.es">info@wodproleague.es</a></p>
        <p className="text-white text-[13px]">Política de privacidad</p>
      </div>
    </div>
  );
};

export default Footer;
