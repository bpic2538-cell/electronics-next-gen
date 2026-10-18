/* ELEC QUEST: homepage hero from GitHub Pages, independent of Google Drive. */
(()=>{'use strict';
  const heroPath='images/home/hero-background.png';
  const apply=()=>{
    const photo=document.querySelector('#home.hero-banner .hero-photo');
    if(photo){
      photo.style.setProperty('background-image',`url("${heroPath}")`,'important');
      photo.style.setProperty('background-size','cover','important');
      photo.style.setProperty('background-position','center center','important');
    }
    const home=document.querySelector('#home.hero');
    if(home && !photo){
      home.style.setProperty('background-image',`linear-gradient(90deg,rgba(8,10,34,.91),rgba(8,10,34,.22)),url("${heroPath}")`,'important');
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
