/* ELEC QUEST Drive image sync: public read-only JSONP feed. */
(()=>{
const endpoint=window.ELEC_DRIVE_FEED_URL;
if(!endpoint){console.info('ELEC QUEST: add Apps Script URL in drive-config.js');return;}
const initial=new WeakMap();let mapped={};
function localPath(src){try{const u=new URL(src,location.href),base=new URL('.',location.href);return u.href.startsWith(base.href)?decodeURIComponent(u.href.slice(base.href.length)):null}catch{return null}}
function apply(){
 document.querySelectorAll('img[src]').forEach(img=>{let p=initial.get(img);if(!p){p=localPath(img.getAttribute('src'));if(!p)return;initial.set(img,p)}const next=mapped[p]||p;if(img.getAttribute('src')!==next)img.src=next});
 const hero=mapped['images/home/hero-background.png'];let s=document.getElementById('elecDriveHero');if(hero){if(!s){s=document.createElement('style');s.id='elecDriveHero';document.head.append(s)}s.textContent='#home.hero-banner .hero-photo,#home.hero{background-image:url('+JSON.stringify(hero)+')!important}'}else if(s)s.remove();
}
const cb='elecDriveFeed'+Date.now();let script=document.createElement('script');let done=false;
window[cb]=(data)=>{done=true;delete window[cb];script.remove();if(!data||data.ok!==true||typeof data.images!=='object'){console.warn('Drive feed failed',data);return}mapped=data.images;apply();new MutationObserver(()=>apply()).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']})};
script.onerror=()=>{delete window[cb];console.warn('ELEC QUEST: Drive feed unavailable')};
script.src=endpoint+(endpoint.includes('?')?'&':'?')+'callback='+encodeURIComponent(cb)+'&t='+Date.now();document.head.append(script);
})();
