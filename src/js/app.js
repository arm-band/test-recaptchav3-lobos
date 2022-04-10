window.addEventListener('load', () => {
    const helloMori = 'hello Mori!';

    console.log(helloMori);

    const sHelloMori = document.querySelector('#hello');
    if(sHelloMori !== undefined && sHelloMori !== null) {
        sHelloMori.textContent = helloMori;
    }
});
