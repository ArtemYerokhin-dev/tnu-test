(function(){
  // Висота шапки для відео на головній
  var hero=document.querySelector('.hero');
  if(hero){ var fit=function(){ var u=document.querySelector('.utility'),n=document.getElementById('navbar'); document.documentElement.style.setProperty('--top-h',((u?u.offsetHeight:0)+(n?n.offsetHeight:0))+'px'); }; fit(); window.addEventListener('resize',fit); }
})();
(function(){
  // Плавна поява блоків; без підтримки чи за «менше руху» все видно одразу
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sel='.sm-sec,.section-block,.sec,.ccard,.fx,.qa-section,.programs-prev .container>*,.main-news,.news-list>*,.sidebar-card,.facts-band .fx';
  var els=[].slice.call(document.querySelectorAll(sel));
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el,i){ el.classList.add('rv'); el.style.transitionDelay=(el.classList.contains('fx')?(i%3)*90:0)+'ms'; io.observe(el); });
})();
