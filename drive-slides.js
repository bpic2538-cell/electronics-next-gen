/* ELEC QUEST — Google Drive folder images in the site's existing slides. */
(()=>{'use strict';
const endpoint=window.ELEC_DRIVE_GALLERY_URL;
if(!endpoint)return;
const byGroup={};
const urlOf=x=>x&&(/^(https:\/\/)/.test(x.url||'')?x.url:(x.id?'https://drive.google.com/thumbnail?id='+encodeURIComponent(x.id)+'&sz=w1600':''));
const normalize=x=>(x||[]).map(v=>({name:v.name||'',url:urlOf(v)})).filter(v=>v.url);
function getData(p){if(!p||p.ok===false||!Array.isArray(p.groups)){console.warn('ELEC QUEST: invalid gallery feed',p);return;}
 p.groups.forEach(g=>{byGroup[g.id]={images:normalize(g.images),children:(g.children||[]).map(c=>({id:c.id,name:c.name,images:normalize(c.images)}))};});
 install();}
function setupSlider(root,items,opts){if(!root||!items.length)return;
 const img=root.querySelector(opts.img||'img');if(!img)return;
 const caption=root.querySelector(opts.caption||'.facility-slide-title');const count=root.querySelector(opts.count||'.facility-count');
 const dotbox=root.querySelector(opts.dots||'.facility-dots');let pos=0;
 const set=(n)=>{pos=(n+items.length)%items.length;img.src=items[pos].url;img.alt=items[pos].name||'ภาพจาก Google Drive';if(caption)caption.textContent=items[pos].name||'ภาพกิจกรรม';if(count)count.textContent=(pos+1)+' / '+items.length;
 if(dotbox){dotbox.replaceChildren();items.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','ภาพที่ '+(i+1));b.className=i===pos?'active':'';b.addEventListener('click',e=>{e.stopPropagation();set(i)});dotbox.append(b);});}};
 for(const cls of [opts.prev,opts.next]){const btn=root.querySelector(cls);if(btn)btn.addEventListener('click',e=>{e.stopImmediatePropagation();set(pos+(cls===opts.prev?-1:1))},true);}
 // Original site's slideshow timer may change src; immediately restore the Drive slide.
 let internal=false;new MutationObserver(()=>{if(!internal&&img.getAttribute('src')!==items[pos].url){internal=true;img.src=items[pos].url;internal=false;}}).observe(img,{attributes:true,attributeFilter:['src']});
 set(0);
}
function install(){
 const about=byGroup.about?.images||[];
 if(about.length){const box=document.querySelector('.about-slider');if(box){const host=box.querySelector('.about-slides');host.replaceChildren();about.forEach((item,i)=>{const fig=document.createElement('figure');fig.className='about-slide'+(i===0?' active':'');const img=document.createElement('img');img.src=item.url;img.alt=item.name;const cap=document.createElement('figcaption');cap.textContent=item.name;fig.append(img,cap);host.append(fig);});
 let pos=0;const dots=box.querySelector('.about-dots');const show=n=>{pos=(n+about.length)%about.length;[...host.children].forEach((f,i)=>f.classList.toggle('active',i===pos));dots.replaceChildren();about.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className=i===pos?'active':'';b.addEventListener('click',e=>{e.stopPropagation();show(i)});dots.append(b)})};
 for(const [sel,dir] of [['.about-prev',-1],['.about-next',1]])box.querySelector(sel)?.addEventListener('click',e=>{e.stopImmediatePropagation();show(pos+dir)},true);show(0);
 }}
 const learn=byGroup.learn?.children||[];const topicIds=['electronics','sensors','microcontroller',null,'audiovisual'];
 const buttons=[...document.querySelectorAll('.learn-topic')],viewer=document.querySelector('.learn-carousel');
 if(viewer){let topic=0,pos=0;const img=viewer.querySelector('#learnImage'),caption=viewer.querySelector('#learnCaption'),dots=viewer.querySelector('.learn-dots');
 const images=()=>learn.find(x=>x.id===topicIds[topic])?.images||[];
 const show=n=>{const arr=images();if(!arr.length)return;pos=(n+arr.length)%arr.length;img.src=arr[pos].url;img.alt=arr[pos].name;caption.textContent=arr[pos].name||'ภาพจาก Google Drive';dots.replaceChildren();arr.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className=i===pos?'active':'';b.addEventListener('click',e=>{e.stopPropagation();show(i)});dots.append(b)})};
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{topic=i;pos=0;queueMicrotask(()=>show(0))}));
 for(const [sel,dir] of [['.learn-prev',-1],['.learn-next',1]])viewer.querySelector(sel)?.addEventListener('click',e=>{if(!images().length)return;e.stopImmediatePropagation();show(pos+dir)},true);
 let changing=false;new MutationObserver(()=>{const arr=images();if(!changing&&arr.length&&img.src!==arr[pos]?.url){changing=true;img.src=arr[pos].url;changing=false}}).observe(img,{attributes:true,attributeFilter:['src']});show(0);
 }
 const facilities=byGroup.facilities?.children||[];const facIds=['sensor-lab','computer-lab','micro-lab','business-room','av-room','activity-area'];
 document.querySelectorAll('.facilities-grid .facility').forEach((card,i)=>{const arr=facilities.find(x=>x.id===facIds[i])?.images||[];setupSlider(card,arr,{prev:'.facility-prev',next:'.facility-next'});});
 const equipment=byGroup.equipment?.children||[];const eqIds=['sensor-kit','micro-kit','industrial-simulator','robot-control','line-robot','workplace'];
 document.querySelectorAll('.equipment-item').forEach((card,i)=>{const arr=equipment.find(x=>x.id===eqIds[i])?.images||[];setupSlider(card,arr,{prev:'.equipment-prev',next:'.equipment-next',caption:'.equipment-slide-title',count:'.equipment-count',dots:'.equipment-dots'});});
 const business=byGroup.business?.images||[];
 if(business.length){const root=document.querySelector('.bpic-slider');if(root)setupSlider(root,business,{prev:'.bpic-prev',next:'.bpic-next',caption:'.bpic-caption',count:'.bpic-count',dots:'.bpic-dots'});}
}
const callback='elecFolderSlides_'+Date.now();window[callback]=p=>{getData(p);delete window[callback]};const s=document.createElement('script');s.src=endpoint+(endpoint.includes('?')?'&':'?')+'callback='+callback;s.onerror=()=>console.error('ELEC QUEST: Google Apps Script cannot be loaded');document.head.append(s);
})();
