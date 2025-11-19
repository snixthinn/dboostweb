// D-Boost Odoo-like site JS
const WA_NUMBER = "621234567890";

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#year').forEach(e=> e.textContent = new Date().getFullYear());

  // Hero slider simple (cycling hero variants inside hero-large if present)
  const hero = document.querySelector('.hero-large');
  if(hero){
    const slides = [
      {title: 'Business apps, integrations, and analytics that actually boost growth', subtitle: 'D-Boost builds tailored, scalable systems — from automation to analytics — so teams move faster.'},
      {title: 'Automate workflows & reduce friction', subtitle: 'From quoting to billing — automation that cuts time and errors.'},
      {title: 'Turn data into decisions', subtitle: 'Analytics pipelines and dashboards that move the needle.'}
    ];
    let hidx = 0;
    const dots = document.querySelector('.hs-dots');
    slides.forEach((s,i)=>{
      const b = document.createElement('button');
      b.dataset.i = i;
      b.addEventListener('click', ()=> showHero(i));
      dots.appendChild(b);
    });
    const prev = document.querySelector('.hs.prev'); const next = document.querySelector('.hs.next');
    prev && prev.addEventListener('click', ()=> showHero((hidx-1+slides.length)%slides.length));
    next && next.addEventListener('click', ()=> showHero((hidx+1)%slides.length));
    let auto = setInterval(()=> showHero((hidx+1)%slides.length), 6000);
    hero.addEventListener('mouseenter', ()=> clearInterval(auto));
    function showHero(i){
      hidx = i;
      const t = slides[i];
      const head = document.querySelector('.hero-text .big');
      const lead = document.querySelector('.hero-text .lead');
      if(head) head.innerHTML = t.title.replace('boost growth','<span class="accent">boost growth</span>');
      if(lead) lead.textContent = t.subtitle;
      Array.from(dots.children).forEach((d,di)=> d.style.background = di===i ? 'var(--primary)' : 'rgba(11,102,255,0.12)');
    }
    showHero(0);
  }

  // intersection observer animations
  const io = new IntersectionObserver(entries => {
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, {threshold:0.12});
  document.querySelectorAll('.fade-up, .slide-left, .slide-right, .slide-up').forEach(el=> io.observe(el));

  // smooth multipage navigation
  document.body.addEventListener('click', (ev)=>{
    const a = ev.target.closest('a[data-link]');
    if(a){
      const href = a.getAttribute('href');
      if(href && href.startsWith('/')){
        ev.preventDefault();
        history.pushState(null,'',href);
        fetchAndSwap(href);
      }
    }
  });
  window.addEventListener('popstate', ()=> fetchAndSwap(location.pathname));

  async function fetchAndSwap(path){
    try{
      const res = await fetch(path, {cache:'no-store'});
      if(!res.ok) return;
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html,'text/html');
      const newMain = doc.getElementById('main-content');
      if(newMain){
        const oldMain = document.getElementById('main-content');
        oldMain.style.opacity = 0;
        await new Promise(r=> setTimeout(r,200));
        oldMain.innerHTML = newMain.innerHTML;
        oldMain.style.opacity = 1;
        // re-observe animations
        document.querySelectorAll('.fade-up, .slide-left, .slide-right, .slide-up').forEach(el=>{
          el.classList.remove('is-visible'); io.observe(el);
        });
        // update nav active
        document.querySelectorAll('.nav .nav-link').forEach(link=>{
          link.classList.toggle('active', link.getAttribute('href') === path);
        });
        document.title = doc.title || 'D-Boost';
      }
    }catch(err){ console.error(err) }
  }

  // contact form -> WhatsApp
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const company = document.getElementById('company')?.value || '';
      const message = document.getElementById('message')?.value || '';
      const text = `Hello D-Boost!%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ACompany: ${encodeURIComponent(company)}%0AMessage: ${encodeURIComponent(message)}`;
      const waUrl = `https://wa.me/${6285691570707}?text=${text}`;
      window.open(waUrl, '_blank');
    });
  }

  const waDirect = document.getElementById('wa-direct');
  if(waDirect) waDirect.addEventListener('click', ()=> window.open(`https://wa.me/${6285691570707}`, '_blank'));

  // accessibility focus outline when tabbing
  document.body.addEventListener('keydown', (e)=> { if(e.key === 'Tab') document.documentElement.classList.add('kbd-nav') });
});
