/* app.js - Portfolio Nguyen Thien Khang */

/* 1. DARK MODE */
(function(){
  var KEY='khang-theme', html=document.documentElement;
  function set(t){ html.setAttribute('data-theme',t); localStorage.setItem(KEY,t); }
  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('darkmode-toggle');
    btn&&btn.addEventListener('click',function(){ set(html.getAttribute('data-theme')==='dark'?'light':'dark'); });
  });
})();

/* 2. NAVBAR */
document.addEventListener('DOMContentLoaded',function(){
  var nav=document.getElementById('navbar');
  var burger=document.getElementById('hamburger');
  var mob=document.getElementById('nav-mobile');
  var links=document.querySelectorAll('.nav-link');

  if(nav) window.addEventListener('scroll',function(){ nav.classList.toggle('scrolled',window.scrollY>20); },{passive:true});

  if(burger&&mob){
    burger.addEventListener('click',function(e){
      e.stopPropagation();
      var o=mob.classList.toggle('open');
      burger.classList.toggle('open',o);
      burger.setAttribute('aria-expanded',o);
    });
    mob.querySelectorAll('.nav-link').forEach(function(l){
      l.addEventListener('click',function(){ mob.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); });
    });
    document.addEventListener('click',function(e){ if(nav&&!nav.contains(e.target)){ mob.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); } });
  }

  var secs=document.querySelectorAll('section[id]');
  if(secs.length&&'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          links.forEach(function(l){
            l.classList.toggle('active', l.getAttribute('href')==='#'+en.target.id);
          });
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(sec){ io.observe(sec); });
  }
});

/* 3. SCROLL PROGRESS */
document.addEventListener('DOMContentLoaded',function(){
  var bar=document.getElementById('scroll-progress');
  if(!bar) return;
  window.addEventListener('scroll',function(){ var m=document.documentElement.scrollHeight-window.innerHeight; bar.style.width=m>0?(window.scrollY/m*100)+'%':'0%'; },{passive:true});
});

/* 4. TABS */
document.addEventListener('DOMContentLoaded',function(){
  var btns=document.querySelectorAll('.tab-btn');
  var panels=document.querySelectorAll('.tab-panel');
  if(!btns.length) return;
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var tid=btn.getAttribute('aria-controls');
      btns.forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      panels.forEach(function(p){ if(p.id===tid){ p.removeAttribute('hidden'); }else{ p.setAttribute('hidden',''); } });
      if(typeof AOS!=='undefined') AOS.refreshHard();
    });
    btn.addEventListener('keydown',function(e){
      var i=Array.from(btns).indexOf(btn), n=null;
      if(e.key==='ArrowRight') n=btns[(i+1)%btns.length];
      if(e.key==='ArrowLeft')  n=btns[(i-1+btns.length)%btns.length];
      if(n){ n.focus(); n.click(); }
    });
  });
});

/* 5. FILTER */
document.addEventListener('DOMContentLoaded',function(){
  var fbts=document.querySelectorAll('.filter-btn');
  var slides=document.querySelectorAll('.proj-swiper .swiper-slide');
  if(!fbts.length) return;
  fbts.forEach(function(btn){
    btn.addEventListener('click',function(){
      var f=btn.dataset.filter;
      fbts.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      slides.forEach(function(sl){ var t=(sl.dataset.tech||'').toLowerCase(); sl.style.display=(f==='all'||t.includes(f.toLowerCase()))?'':'none'; });
    });
  });
});

/* 6. MODAL */
document.addEventListener('DOMContentLoaded',function(){
  var ov=document.getElementById('modal-overlay');
  var cl=document.getElementById('modal-close');
  if(!ov) return;

  function confetti(){
    var c=document.getElementById('modal-confetti'); if(!c) return; c.innerHTML='';
    var cols=['#2563eb','#3b82f6','#60a5fa','#facc15','#34d399','#f87171'];
    for(var i=0;i<20;i++){
      var p=document.createElement('div'); p.className='confetti-particle';
      p.style.cssText='left:'+Math.random()*100+'%;background:'+cols[Math.floor(Math.random()*6)]+';width:'+(5+Math.random()*5)+'px;height:'+(5+Math.random()*5)+'px;border-radius:'+(Math.random()>.5?'50%':'2px')+';animation-delay:'+Math.random()*.4+'s;animation-duration:'+(0.8+Math.random()*.6)+'s;';
      c.appendChild(p);
    }
  }

  function open(id){
    var d=(window.PROJECTS||{})[id]; if(!d) return;
    var s=function(eid,v){ var e=document.getElementById(eid); if(e) e.textContent=v; };
    s('modal-title',d.title||''); s('modal-type',d.type||'');
    var desc=document.getElementById('modal-desc'); if(desc) desc.textContent=d.desc||'';

    // Show real image or emoji fallback
    var ph=document.getElementById('modal-ph');
    var modalImg=document.querySelector('.modal-img');
    if(d.img && ph){
      ph.innerHTML='<img src="'+d.img+'" alt="'+d.title+'" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" onerror="this.parentElement.innerHTML=\''+d.emoji+'\'" />';
    } else if(ph){
      ph.innerHTML=d.emoji||'&#128187;';
    }
    var tg=document.getElementById('modal-tags'); if(tg) tg.innerHTML=(d.tags||[]).map(function(t){ return '<span class="tag">'+t+'</span>'; }).join('');
    var lk=document.getElementById('modal-links'); if(lk){ lk.innerHTML=''; if(d.github){ var a=document.createElement('a'); a.href=d.github; a.className='btn btn-outline'; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent='GitHub'; lk.appendChild(a); } }
    ov.removeAttribute('hidden'); document.body.style.overflow='hidden';
    confetti(); cl&&cl.focus();
  }

  function close(){ ov.setAttribute('hidden',''); document.body.style.overflow=''; }

  document.querySelectorAll('.proj-btn').forEach(function(btn){ btn.addEventListener('click',function(){ open(btn.dataset.project); }); });
  cl&&cl.addEventListener('click',close);
  ov.addEventListener('click',function(e){ if(e.target===ov) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!ov.hasAttribute('hidden')) close(); });
});

/* 7. FORM */
document.addEventListener('DOMContentLoaded',function(){
  var form=document.getElementById('contact-form');
  var succ=document.getElementById('c-success');
  var fbtn=document.getElementById('f-btn');
  if(!form) return;

  function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
  function err(fi,ei,m){ var f=document.getElementById(fi),e=document.getElementById(ei); if(f){f.classList.remove('ok');f.classList.add('err');} if(e) e.textContent=m; }
  function ok(fi,ei){ var f=document.getElementById(fi),e=document.getElementById(ei); if(f){f.classList.remove('err');f.classList.add('ok');} if(e) e.textContent=''; }

  function validate(){
    var v=true;
    var n=document.getElementById('form-name');
    if(!n||n.value.trim().length<2){ err('form-name','err-name','Vui long nhap ho va ten (it nhat 2 ky tu)'); v=false; } else ok('form-name','err-name');
    var em=document.getElementById('form-email');
    if(!em||!isEmail(em.value)){ err('form-email','err-email','Email chua hop le'); v=false; } else ok('form-email','err-email');
    var mg=document.getElementById('form-msg');
    if(!mg||mg.value.trim().length<10){ err('form-msg','err-msg','Noi dung phai co it nhat 10 ky tu'); v=false; } else ok('form-msg','err-msg');
    return v;
  }

  ['form-name','form-email','form-msg'].forEach(function(id){ var e=document.getElementById(id); e&&e.addEventListener('blur',validate); });

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!validate()) return;
    if(fbtn){ fbtn.disabled=true; var t=fbtn.querySelector('.btn-text'),l=fbtn.querySelector('.btn-load'); if(t) t.hidden=true; if(l) l.hidden=false; }
    setTimeout(function(){ form.hidden=true; if(succ) succ.removeAttribute('hidden'); },1500);
  });
});

/* 8. SWIPER */
document.addEventListener('DOMContentLoaded',function(){
  if(typeof Swiper==='undefined') return;
  new Swiper('.proj-swiper',{
    effect:'coverflow', grabCursor:true, centeredSlides:true, slidesPerView:'auto',
    coverflowEffect:{rotate:18,stretch:0,depth:130,modifier:1,slideShadows:false},
    pagination:{el:'.swiper-pagination',clickable:true},
    navigation:{nextEl:'.swiper-button-next',prevEl:'.swiper-button-prev'},
    autoplay:{delay:4500,pauseOnMouseEnter:true,disableOnInteraction:false},
    keyboard:{enabled:true}
  });
});

/* 9. AOS */
document.addEventListener('DOMContentLoaded',function(){
  if(typeof AOS!=='undefined') AOS.init({once:true,duration:650,easing:'ease-out-back',offset:50});
});

/* 10. TYPED */
document.addEventListener('DOMContentLoaded',function(){
  var el=document.getElementById('typed-role');
  if(!el||typeof Typed==='undefined') return;
  new Typed(el,{strings:window.TYPED_STR||['Developer'],typeSpeed:60,backSpeed:40,backDelay:1800,loop:true,smartBackspace:true});
});

/* 11. GPA BAR */
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.pbar-fill').forEach(function(b){
    new IntersectionObserver(function(es){
      if(es[0].isIntersecting){ b.style.width=(parseFloat(b.dataset.pct)||0)+'%'; }
    },{threshold:.3}).observe(b);
  });
});

/* 12. SKILL HOVER (GSAP) */
document.addEventListener('DOMContentLoaded',function(){
  if(typeof gsap==='undefined') return;
  document.querySelectorAll('.skill-card').forEach(function(c){
    c.addEventListener('mouseenter',function(){ gsap.to(c,{y:-7,scale:1.04,duration:.22,ease:'back.out(2)'}); });
    c.addEventListener('mouseleave',function(){ gsap.to(c,{y:0,scale:1,duration:.22}); });
  });
});

/* 13. JOJO CURSOR */
document.addEventListener('DOMContentLoaded', function () {
  var cur = document.getElementById('custom-cursor');
  var oraContainer = document.getElementById('ora-container');
  if (!cur || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  var ORA_WORDS = ['ORA!', 'ORA ORA!', 'MUDA!', 'WRYYYY!', 'ORA ORA ORA!', 'YARE YARE...'];
  var cx = 0, cy = 0;

  // Smooth cursor follow
  if (typeof gsap !== 'undefined') {
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      gsap.to(cur, { x: cx, y: cy, duration: 0.1, ease: 'power2.out', overwrite: true });
    });
  } else {
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      cur.style.left = cx + 'px';
      cur.style.top  = cy + 'px';
    });
  }

  // Hover effect
  var interactives = document.querySelectorAll('a, button, .skill-card, .proj-card, .filter-btn, .tab-btn');
  interactives.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cur.classList.add('hovering'); });
    el.addEventListener('mouseleave', function () { cur.classList.remove('hovering'); });
  });

  // Click: ORA ORA text burst
  document.addEventListener('click', function (e) {
    cur.classList.add('clicking');
    setTimeout(function () { cur.classList.remove('clicking'); }, 150);

    if (!oraContainer) return;

    // Spawn 1-3 ORA texts
    var count = Math.floor(Math.random() * 2) + 1;
    for (var i = 0; i < count; i++) {
      (function (idx) {
        setTimeout(function () {
          var word = ORA_WORDS[Math.floor(Math.random() * ORA_WORDS.length)];
          var el = document.createElement('div');
          el.className = 'ora-text';
          var rot = (Math.random() * 30 - 15);
          var offsetX = (Math.random() * 60 - 30);
          el.style.cssText = [
            'left:' + (e.clientX + offsetX - 20) + 'px',
            'top:' + (e.clientY - 10) + 'px',
            '--rot:' + rot + 'deg',
            'animation-delay:' + (idx * 80) + 'ms'
          ].join(';');
          el.textContent = word;
          oraContainer.appendChild(el);
          // Remove after animation
          setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          }, 800);
        }, idx * 60);
      })(i);
    }
  });
});

/* 14. 3D CARD TILT */
document.addEventListener('DOMContentLoaded', function () {
  // Apply tilt to project cards and skill cards
  var tiltCards = document.querySelectorAll('.proj-card, .skill-card');

  tiltCards.forEach(function (card) {
    // Wrap with perspective container
    var wrapper = document.createElement('div');
    wrapper.className = 'tilt-wrap';
    card.parentNode.insertBefore(wrapper, card);
    wrapper.appendChild(card);

    var MAX_TILT = 15;   // max degrees
    var MAX_SHINE = 0.3; // max shine opacity

    // Create shine overlay
    var shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.style.position = 'relative';
    card.appendChild(shine);

    function getCardCenter(card) {
      var rect = card.getBoundingClientRect();
      return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, w: rect.width, h: rect.height };
    }

    card.addEventListener('mousemove', function (e) {
      var c = getCardCenter(card);
      // Normalize -1 to 1
      var dx = (e.clientX - c.cx) / (c.w / 2);
      var dy = (e.clientY - c.cy) / (c.h / 2);

      var rotateY =  dx * MAX_TILT;
      var rotateX = -dy * MAX_TILT;

      // Shine position (follows mouse)
      var shineX = (dx + 1) / 2 * 100;
      var shineY = (dy + 1) / 2 * 100;
      var shineDist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2);

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.04,1.04,1.04)';
      card.style.transition = 'transform 0.1s ease';
      card.style.zIndex = '10';

      shine.style.background = 'radial-gradient(circle at ' + shineX + '% ' + shineY + '%, rgba(255,255,255,' + (shineDist * MAX_SHINE) + ') 0%, transparent 70%)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      card.style.zIndex = '';
      shine.style.background = 'none';
    });

    // Tap feedback on touch devices
    card.addEventListener('touchstart', function () {
      card.style.transform = 'perspective(800px) scale3d(0.97,0.97,1)';
    }, { passive: true });
    card.addEventListener('touchend', function () {
      card.style.transform = '';
    });
  });
});
