/**
 * @description Google Analytics global site tag code
 * @author Tatiana Williamson
 * @since Apr 27, 2020
 */
if (document.location.hostname.search("sparql.glygen.org" || "beta-sparql.glygen.org") === 0) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-123338976-1');
}


