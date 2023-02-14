/*---------------Salute---------------------*/

const ELEMENT_SALUTE = document.getElementById( 'salute-animation' );
const IMAGE_1 = new Image();
const IMAGE_2 = new Image();

IMAGE_1.src = 'images/Salute-var1.png';
IMAGE_2.src = 'images/Salute-var2.png';

const IMAGE = [ IMAGE_1.src, IMAGE_2.src ];

let i = 0;

setInterval( ()=> {
    if ( i > 1 ) {
        i = 0
    }
    ELEMENT_SALUTE.src = IMAGE[i];
    i++;
}, 700 );

/*----------------------------Popup------------------*/

const PAGE_POPUP = document.getElementById( 'page-popup' );
const LINKS_TO_VIEW_PROJECT = document.getElementsByClassName( 'item__description--content' );
const ELEMENT_MAIN = document.getElementById( 'page' );
const EXIT_BUTTON = document.getElementById( 'exit-button' );


let isActivePagePopup = false;

for ( const link of LINKS_TO_VIEW_PROJECT ) {
    link.addEventListener( 'click', clickLinksHandler, false );
}

function clickLinksHandler( e ) {
    
    if ( isActivePagePopup ) {
        isActivePagePopup = false;
        PAGE_POPUP.style.display = 'none';
    }else
        if ( !isActivePagePopup ) {
                isActivePagePopup = true;
                PAGE_POPUP.style.display = 'flex';
                PAGE_POPUP.style.position = 'absolute';
                PAGE_POPUP.style.top = window.pageYOffset + ( window.innerHeight - 550 ) / 2 + 'px';
                PAGE_POPUP.style.left = ( window.innerWidth - 800 ) / 2 + 'px';

                const PROJECT_TITLE = document.getElementById( 'project-title' );
                const PROJECT_DESCRIPTION = document.getElementById( 'project-description' );
                const PROJECT_IMAGE = document.getElementById( 'project-image' );

                //console.log( PROJECT_TITLE, PROJECT_DESCRIPTION, PROJECT_IMAGE );
                
                for ( const link of LINKS_TO_VIEW_PROJECT ) {
                    link.removeEventListener( 'click', clickLinksHandler, false );
                }

                EXIT_BUTTON.addEventListener( 'click', closePopupHandler, false );

                setTimeout( () => {
                    ELEMENT_MAIN.addEventListener( 'click', closePopupHandler, false )
                }, 500 );
            }
    //console.log(isActivePagePopup);
}

function closePopupHandler() {
    isActivePagePopup = false;
    PAGE_POPUP.style.display = 'none';

    for ( const link of LINKS_TO_VIEW_PROJECT ) {
        link.addEventListener( 'click', clickLinksHandler, false );
    }

    ELEMENT_MAIN.removeEventListener( 'click', closePopupHandler, false  )
}


if ( !isActivePagePopup ) {
    PAGE_POPUP.style.display = 'none';
}
