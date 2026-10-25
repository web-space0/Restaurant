const M={
"Starters":["#b3122f",[["Paneer Tikka","Charred in the tandoor with mint chutney",299,1,2,1],["Hara Bhara Kebab","Spinach, peas and herbs, pan-seared",249,1,1,0],["Chicken Malai Tikka","Creamy, cardamom-scented, melt-soft",349,0,1,0],["Amritsari Fish Fry","Ajwain-crusted, crisp outside, tender within",379,0,2,0]]],
"Mains":["#d9650a",[["Dal Makhani","18 hours on slow coals, finished with butter",299,1,1,1],["Paneer Lababdar","Smoky cashew and tomato masala",349,1,2,0],["Butter Chicken","Our house signature, tandoor-grilled",399,0,1,1],["Mutton Rogan Josh","Kashmiri chilli, slow-braised on the bone",499,0,3,0]]],
"Biryani & Breads":["#0f6b4f",[["Veg Dum Biryani","Sealed, saffron-laced, served with raita",329,1,2,0],["Chicken Dum Biryani","Aged basmati, slow-cooked in its own steam",429,0,2,1],["Butter Naan","Blistered in the tandoor, brushed with butter",69,1,0,0],["Garlic Kulcha","Stuffed, crisp-edged, fragrant",89,1,0,0]]],
"Sweets":["#e0457b",[["Gulab Jamun","Warm, saffron syrup, pistachio dust",149,1,0,1],["Rasmalai","Soft cheese discs in chilled cardamom milk",179,1,0,0],["Gajar Halwa","Slow-cooked carrot, khoya and almonds",169,1,0,0],["Kulfi Falooda","Rose, vermicelli and creamy kulfi",199,1,0,0]]]};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,$=s=>document.querySelector(s);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
function add(el,cls,delay){if(reduce||!el)return;el.classList.add('rv');if(cls)el.classList.add(cls);el.style.setProperty('--d',(delay||0)+'s');io.observe(el)}
// menu + cart
const all=[];Object.entries(M).forEach(([k,v])=>v[1].forEach(r=>all.push({id:all.length,cat:k,c:v[0],n:r[0],d:r[1],p:r[2],v:r[3],s:r[4],pick:r[5]})));
const cart={};let cat='Starters';
const rows=$('#rows'),tabs=$('#tabs');
function render(){
  const q=$('#q').value.trim().toLowerCase(),vg=$('#vg').checked;
  let list=q?all.filter(x=>(x.n+' '+x.d).toLowerCase().includes(q)):all.filter(x=>x.cat===cat);
  if(vg)list=list.filter(x=>x.v);
  [...tabs.children].forEach(b=>b.setAttribute('aria-selected',!q&&b.textContent===cat));
  rows.innerHTML=list.length?list.map(x=>`<div class="row" style="--c:${x.c}"><h3><span class="${x.v?'veg':'nv'}"></span>${x.n}${x.pick?'<em>Chef’s pick</em>':''}</h3><p>${x.d}${x.s?' '+'🌶️'.repeat(x.s):''}</p><div class="rt"><b>₹${x.p}</b><button class="add ${cart[x.id]?'on':''}" data-id="${x.id}">${cart[x.id]?'Added × '+cart[x.id]:'Add +'}</button></div></div>`).join(''):'<p class="none">No dishes match. Try another word or turn off the vegetarian filter.</p>';
  [...rows.children].forEach((el,i)=>add(el,i%2?'r':'l',i*.07));
}
Object.keys(M).forEach(k=>{const b=document.createElement('button');b.className='tab';b.role='tab';b.textContent=k;b.style.setProperty('--c',M[k][0]);b.onclick=()=>{cat=k;$('#q').value='';render()};tabs.appendChild(b)});
$('#q').oninput=render;$('#vg').onchange=render;
rows.onclick=e=>{const b=e.target.closest('.add');if(!b)return;const id=+b.dataset.id;cart[id]=(cart[id]||0)+1;b.classList.add('on');b.textContent='Added × '+cart[id];sync()};
function sync(){
  const ids=Object.keys(cart).filter(i=>cart[i]>0);let tot=0,n=0;
  $('#items').innerHTML=ids.length?ids.map(i=>{const x=all[i],q=cart[i];tot+=x.p*q;n+=q;return `<div class="ci"><div><b>${x.n}</b><small>₹${x.p} each</small></div><div class="qty"><button data-i="${i}" data-d="-1" aria-label="Remove one">−</button>${q}<button data-i="${i}" data-d="1" aria-label="Add one">+</button></div></div>`}).join(''):'<p style="color:var(--soft)">Your order is empty. Add dishes from the menu.</p>';
  $('#cc').textContent=n;$('#tt').textContent='₹'+tot;
  const msg='Hello Shyam, I would like to order:\n'+ids.map(i=>`${cart[i]} × ${all[i].n} (₹${all[i].p*cart[i]})`).join('\n')+`\nTotal: ₹${tot}`;
  $('#wa').href='https://wa.me/?text='+encodeURIComponent(msg);$('#wa').style.opacity=ids.length?1:.5;
}
$('#items').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;cart[b.dataset.i]=Math.max(0,cart[b.dataset.i]+ +b.dataset.d);sync();render()};
const open=o=>document.body.classList.toggle('open',o);
$('#cb').onclick=()=>open(true);$('#cx').onclick=$('#ov').onclick=()=>open(false);addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
// theme toggle (dark is the default; the choice is remembered where the browser allows)
const root=document.documentElement;let saved;try{saved=localStorage.getItem('shyam-theme')}catch(e){}
function setTheme(t){root.dataset.theme=t;$('#th').textContent=t==='dark'?'☀️':'🌙';try{localStorage.setItem('shyam-theme',t)}catch(e){}}
setTheme(saved||'dark');$('#th').onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark');
render();sync();
// reveal
document.querySelectorAll('.head').forEach(el=>add(el));
add($('.story .wrap>div:first-child'),'l');
document.querySelectorAll('.tiles div').forEach((el,i)=>add(el,i%2?'r':'l',i*.12));
document.querySelectorAll('.xs div').forEach((el,i)=>add(el,['l','','r'][i],i*.15));
document.querySelectorAll('.q blockquote').forEach((el,i)=>add(el,['l','','r'][i],i*.15));
add($('.res .wrap>div:first-child'),'l');add($('.card'),'r',.15);
// scroll: hero depth, ribbon skew, progress bar
const hero=$('.hero'),rb=$('.ribbon'),bar=$('#bar');let last=scrollY,busy=false,idle;
addEventListener('scroll',()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${h>0?y/h:0})`;
  if(!reduce){hero.style.setProperty('--p',Math.min(1,y/(hero.offsetHeight*.85)).toFixed(3));rb.style.setProperty('--sk',Math.max(-5,Math.min(5,(y-last)*.12)).toFixed(2));clearTimeout(idle);idle=setTimeout(()=>rb.style.setProperty('--sk',0),120)}
  last=y;busy=false})},{passive:true});
// count-up
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,to=+el.dataset.n,s=el.dataset.s||'';
  if(reduce){el.textContent=to+s;return}const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+s;if(k<1)requestAnimationFrame(f)})(t0)}));
document.querySelectorAll('[data-n]').forEach(el=>co.observe(el));
// tilt on hover devices
if(!reduce&&matchMedia('(hover:hover)').matches){
  const t=$('#tilt');
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`rotateY(${x*28}deg) rotateX(${-y*24}deg)`});
  hero.addEventListener('pointerleave',()=>t.style.transform='');
  document.querySelectorAll('.tiles div,.q blockquote,.xs div').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg) translateZ(14px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='')});
}
// booking
const d=$('#d');d.min=d.value=new Date().toISOString().slice(0,10);
$('#go').onclick=()=>{const ok=$('#ok'),n=$('#n').value.trim();ok.style.display='block';
  ok.textContent=n?`Thank you, ${n}. We’ve noted a table for ${$('#g').value} on ${d.value} at ${$('#t').value}. We’ll call to confirm.`:'Please enter your name to confirm the reservation.'};
