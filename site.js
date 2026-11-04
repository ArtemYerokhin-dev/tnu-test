(function(){
  // Спільна поведінка шапки. Клонування прибирає старі обробники зі сторінок, щоб шапка працювала однаково всюди.
  function fresh(el){ if(!el) return el; var c=el.cloneNode(true); el.parentNode.replaceChild(c,el); return c; }
  var q=function(s){return document.querySelector(s)}, qa=function(s){return [].slice.call(document.querySelectorAll(s))};
  fresh(q('.nav-links')); qa('.mega-wrap').forEach(fresh);
  var navItems=qa('.has-mega'), megas=qa('.mega-wrap'), timer, hover=window.matchMedia('(hover:hover)').matches;
  function closeMega(){ megas.forEach(function(m){m.classList.remove('open')}); navItems.forEach(function(i){i.classList.remove('open'); i.firstElementChild.setAttribute('aria-expanded','false')}); }
  function openMega(item){ clearTimeout(timer); closeMega(); var m=document.getElementById('menu-'+item.dataset.menu); if(m) m.classList.add('open'); item.classList.add('open'); item.firstElementChild.setAttribute('aria-expanded','true'); }
  function later(){ clearTimeout(timer); timer=setTimeout(closeMega,150); }
  // Пункт із випадним меню нікуди не веде: мишею меню лише відкривається, на дотик і з клавіатури перемикається
  navItems.forEach(function(i){
    if(hover){ i.addEventListener('mouseenter',function(){openMega(i)}); i.addEventListener('mouseleave',later); }
    i.firstElementChild.addEventListener('click',function(e){
      if(hover&&e.detail){ openMega(i); return; }
      if(i.classList.contains('open')){ closeMega(); return; }
      openMega(i); if(!e.detail){ var a=q('#menu-'+i.dataset.menu+' a'); if(a) a.focus(); }
    });
  });
  megas.forEach(function(m){
    if(hover){ m.addEventListener('mouseenter',function(){clearTimeout(timer)}); m.addEventListener('mouseleave',later); }
    m.addEventListener('click',function(e){ if(e.target.closest('a')) closeMega(); });
    m.addEventListener('focusout',function(e){ if(e.relatedTarget&&!m.contains(e.relatedTarget)) closeMega(); });
  });
  document.addEventListener('click',function(e){ if(!e.target.closest('.has-mega,.mega-wrap')) closeMega(); });
  var btn=fresh(q('#searchBtn')), panel=q('#searchPanel'), input=q('#searchPanelInput'), close=fresh(q('#searchPanelClose'));
  function closeSearch(){ panel.classList.remove('open'); btn.classList.remove('active'); }
  btn.addEventListener('click',function(){ var o=panel.classList.toggle('open'); btn.classList.toggle('active',o); if(o){ panel.style.top=q('#navbar').getBoundingClientRect().bottom+'px'; setTimeout(function(){input.focus()},50); } });
  close.addEventListener('click',closeSearch);
  var burger=fresh(q('#navBurger')), mob=q('#mobMenu'), ov=fresh(q('#mobOverlay')), mc=fresh(q('#mobClose'));
  function openMob(){ burger.classList.add('open'); mob.classList.add('open'); ov.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeMob(){ burger.classList.remove('open'); mob.classList.remove('open'); ov.classList.remove('open'); document.body.style.overflow=''; }
  burger.addEventListener('click',openMob); mc.addEventListener('click',closeMob); ov.addEventListener('click',closeMob);
  fresh(q('.mob-nav')); qa('.mob-item-head[data-mob]').forEach(function(h){ h.addEventListener('click',function(){ h.classList.toggle('open'); document.getElementById('mob-'+h.dataset.mob).classList.toggle('open'); }); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeSearch(); closeMega(); closeMob(); } });
  // Вкладки: кожна має власну адресу
  var groups=qa('[data-tabs]');
  function activate(id,push){
    var done=false;
    groups.forEach(function(g){ var bs=[].slice.call(g.querySelectorAll('[data-t]')); if(!bs.some(function(b){return b.dataset.t===id})) return; done=true;
      bs.forEach(function(b){ var on=b.dataset.t===id; b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false'); if(on&&b.scrollIntoView&&window.innerWidth<900) b.scrollIntoView({inline:'center',block:'nearest'}); }); });
    if(done){ qa('.pane').forEach(function(p){p.classList.toggle('on',p.dataset.p===id)}); if(push) history.replaceState(null,'','#'+id); }
    return done;
  }
  groups.forEach(function(g){ [].slice.call(g.querySelectorAll('[data-t]')).forEach(function(b){ b.addEventListener('click',function(){activate(b.dataset.t,true)}); }); });
  function fromHash(){ var h=decodeURIComponent(location.hash.slice(1)); if(h) activate(h,false); }
  window.addEventListener('hashchange',fromHash); fromHash();
  if(document.body.hasAttribute('data-tpl')){
    qa('.acc-btn').forEach(function(b){ b.addEventListener('click',function(){ b.classList.toggle('open'); b.setAttribute('aria-expanded',b.classList.contains('open')); b.nextElementSibling.classList.toggle('open'); }); });
    qa('form[data-demo]').forEach(function(f){ f.addEventListener('submit',function(e){ e.preventDefault(); var n=f.querySelector('.form-note'); if(n) n.hidden=false; }); });
    // QR-коди Дії: кожен відкривається окремо, великим
    var dlg=q('#qrDlg');
    if(dlg){ qa('[data-qr]').forEach(function(b){ b.addEventListener('click',function(){ q('#qrDlgImg').src=b.dataset.qr; q('#qrDlgImg').alt='QR-код: '+b.dataset.n; q('#qrDlgT').textContent=b.dataset.n; if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open',''); }); });
      dlg.addEventListener('click',function(e){ if(e.target===dlg||e.target.closest('.qr-dlg-x')) dlg.close(); }); }
    // Пошук серед файлів на сторінці
    qa('[data-filter]').forEach(function(inp){ inp.addEventListener('input',function(){
      var v=inp.value.trim().toLowerCase(), root=q(inp.dataset.filter), total=0;
      [].slice.call(root.querySelectorAll('.accordion')).forEach(function(a){ var n=0; [].slice.call(a.querySelectorAll('.doc-link')).forEach(function(d){ var ok=!v||d.textContent.toLowerCase().indexOf(v)>=0; d.style.display=ok?'':'none'; if(ok)n++; });
        total+=n; a.style.display=n?'':'none'; var bt=a.querySelector('.acc-btn'), bd=a.querySelector('.acc-body'); if(v){bt.classList.add('open');bd.classList.add('open');} });
      var c=q(inp.dataset.count); if(c) c.textContent=v?('Знайдено файлів: '+total):''; }); });
  }
})();
