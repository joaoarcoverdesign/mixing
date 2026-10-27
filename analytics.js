/* Google Analytics 4 — carregado uma vez, incluído em todas as páginas.
   Trocar a propriedade aqui atualiza o site inteiro. */
(function () {
  var ID = 'G-R7PLZLRLYJ';

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ID);

  /* cases vistos: guardados no navegador (a koi da home ganha uma companheira
     depois de 2) e enviados ao GA como evento case_view */
  var m = location.pathname.match(/\/cases\/([^\/]+?)(?:\.html)?$/);
  if (m) {
    var slug = decodeURIComponent(m[1]).replace(/-pt$/, '');
    try {
      var seen = JSON.parse(localStorage.getItem('koi.cases') || '[]');
      if (seen.indexOf(slug) < 0) { seen.push(slug); localStorage.setItem('koi.cases', JSON.stringify(seen)); }
    } catch (e) {}
    gtag('event', 'case_view', { case_slug: slug });
  }
})();
