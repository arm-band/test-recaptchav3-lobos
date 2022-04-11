window.addEventListener('load', () => {
    const sitekeyNumberDom = document.querySelector('#sitekey-number');
    const siteKey = window.siteKeys[parseInt(sitekeyNumberDom.value)];
    grecaptcha.ready(function() {
        try {
            grecaptcha.execute(
                siteKey,
                {
                    action: 'homepage'
                }
                ).then(function( token ) {
                const recaptchaResponseDom = document.querySelector('#g-recaptcha-response');
                recaptchaResponseDom.value = token;
            });
        } catch (e) {
            console.log(e);
        }
    });
});
