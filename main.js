(function(){
  var fmt = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  var input = document.getElementById('ingreso');
  function calc(){
    var v = parseFloat(input.value);
    if(!(v>=0)) v = 0;
    document.getElementById('r50').textContent = fmt.format(v*0.5);
    document.getElementById('r30').textContent = fmt.format(v*0.3);
    document.getElementById('r20').textContent = fmt.format(v*0.2);
  }
  input.addEventListener('input',calc);
  calc();
})();
(function(){
  var cop = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  function $(id){return document.getElementById(id)}
  function num(id){var v=parseFloat($(id).value);return v>0?v:0}
  function set(id,t){$(id).textContent=t}

  // Pestañas de herramientas
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function(t){t.addEventListener('click',function(){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);$(x.dataset.p).hidden=!on});
  })});

  // Meta de ahorro
  function meta(){
    var m=num('mMeta'),a=num('mAhorro'),p=Math.max(1,Math.round(num('mMeses'))),f=Math.max(0,m-a),pct=m?Math.min(100,Math.round(a/m*100)):0;
    set('mCuota',cop.format(f/p));set('mFalta',cop.format(f));set('mPct','Llevas el '+pct+'% de tu meta');
    $('mBar').style.width=pct+'%';
  }
  // Interés compuesto
  function inter(){
    var c=num('iAporte'),t=num('iTasa')/100,n=Math.round(num('iAnios')*12),r=Math.pow(1+t,1/12)-1;
    var fv=r>0?c*(Math.pow(1+r,n)-1)/r:c*n,ap=c*n;
    set('iFinal',cop.format(fv));set('iAport',cop.format(ap));set('iInt',cop.format(fv-ap));
  }
  ['mMeta','mAhorro','mMeses'].forEach(function(i){$(i).addEventListener('input',meta)});
  ['iAporte','iTasa','iAnios'].forEach(function(i){$(i).addEventListener('input',inter)});
  meta();inter();

  // Experiencias
  var qs=[].slice.call(document.querySelectorAll('.q')),dots=$('dots'),qi=0;
  function show(i){
    qi=(i+qs.length)%qs.length;
    qs.forEach(function(q,j){q.classList.toggle('on',j===qi)});
    [].forEach.call(dots.children,function(d,j){d.classList.toggle('on',j===qi)});
  }
  qs.forEach(function(_,i){var b=document.createElement('button');b.setAttribute('aria-label','Experiencia '+(i+1));b.addEventListener('click',function(){show(i)});dots.appendChild(b)});
  $('prev').addEventListener('click',function(){show(qi-1)});
  $('next').addEventListener('click',function(){show(qi+1)});
  show(0);

  // Formulario de contacto
  $('form').addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(e.target),n=d.get('nombre');
    var body='Nombre: '+n+'\nCorreo: '+d.get('correo')+'\n\n'+d.get('mensaje');
    $('okName').textContent=n;
    $('okLink').href='mailto:contacto@monetacademy.com?subject='+encodeURIComponent('Tutoría MonetAcademy: '+d.get('tema'))+'&body='+encodeURIComponent(body);
    e.target.hidden=true;$('ok').hidden=false;
  });

  // Aparición al hacer scroll
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.12});
    [].forEach.call(document.querySelectorAll('.card,.step,.head,.calc,.quotes,.form'),function(el,i){el.classList.add('rv');el.style.setProperty('--d',(i%3)*.12+'s');io.observe(el)});
  }
})();
