const element = document.getElementById( 'salute-animation' );

const image1 = new Image();
const image2 = new Image();
const image3 = new Image();

image1.src = 'images/Salute-var1.png';
image2.src = 'images/Salute-var2.png';

const image = [ image1.src, image2.src];

let i = 0;

setInterval( ()=> {
    if ( i > 1 ) {
        i = 0
    }
    element.src = image[i];
    i++;
}, 700 );

