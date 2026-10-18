/* ELEC QUEST: load homepage banner from root Google Drive folder. */
(()=>{'use strict';
const endpoint=window.ELEC_DRIVE_GALLERY_URL;
if(!endpoint)return;
const cb='elecHero_'+Date.now()+'_'+Math.floor(Math.random()*10000);
let script;
window[cb]=data=>{
  try{
    const hero=data&&data.hero;
    if(!hero||!hero.id){console.warn('ELEC QUEST: hero-background.png not found in Drive root');return;}
    const url='https://drive.google.com/thumbnail?id='+encodeURIComponent(hero.id)+'&sz=w2000';
    const apply=()=>{
      const photo=document.querySelector('#home.hero-banner .hero-photo');
      if(photo){photo.style.setProperty('background-image','url("'+url+'")','important');}
    };
    const img=new Image();img.onload=apply;img.onerror=()=>console.warn('ELEC QUEST: hero image not publicly accessible',url);img.src=url;
  }finally{delete window[cb];if(script)script.remove();}
};
script=document.createElement('script');script.src=endpoint+(endpoint.includes('?')?'&':'?')+'callback='+cb;
script.onerror=()=>{console.warn('ELEC QUEST: failed to load hero feed');delete window[cb]};
document.head.appendChild(script);
})();
