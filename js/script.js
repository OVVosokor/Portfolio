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

/*---------------List Projects---------------*/
const LIST_PROJECTS = [];

class Project {
    //static idGame = 0;
   // static idOthers = 0;
    static id = 0;
    static classOfElement = '';

    constructor( PROJECT_DATA ) { //title, description, srcImage, gitLink, demolink, type
        this.title = PROJECT_DATA.title;
        this.description = PROJECT_DATA.description;
        this.src = PROJECT_DATA.src;
        this.gitLink = PROJECT_DATA.gitLink;
        this.demoLink = PROJECT_DATA.demoLink;
        this.type = PROJECT_DATA.type;
        Project.id++;
        Project.classOfElement = '';

        if ( this.type === 'game' ) {
            Project.classOfElement = 'projects__items--games';
        }else
            if ( this.type === 'other' ) {
                Project.classOfElement = 'projects__items--others';
            }

        //клонируем шаблон
        const TEMPLATE = document.getElementById( 'project-item' );
        const TEMPLATE_BODY_GAMES = document.getElementsByClassName( Project.classOfElement );
        const PROJECT = TEMPLATE.content.cloneNode( true );

        TEMPLATE_BODY_GAMES[0].appendChild(PROJECT);

        //получаем добавленный элемент
        const projects = document.getElementsByClassName( 'projects__items--item' );
        
        for ( let i = 0; i < projects.length; i++ ) {
            if ( projects[i].getAttribute( 'id' ) === '' ) {
                projects[i].setAttribute( 'id', Project.id ); //Project.idGame
                projects[i].setAttribute( 'title', this.title ); 
                projects[i].setAttribute( 'description', this.description ); 
                projects[i].setAttribute( 'src', this.src ); 
                projects[i].setAttribute( 'gitLink', this.gitLink ); 
                projects[i].setAttribute( 'demoLink', this.demoLink ); 
                projects[i].setAttribute( 'demoLink', this.demoLink ); 

                //console.log( projects[i].getAttribute('title') );
                const PROJECT_IMAGE_SRC = projects[i].querySelector( 'img' );
                PROJECT_IMAGE_SRC.src = this.src;
                //console.log( IMAGE_SRC ); description__content--name-project
                const PROJECT_DESCRIPTION = projects[i].querySelector( '.description__content--name-project' );
                //console.log( PROJECT_DESCRIPTION );
                PROJECT_DESCRIPTION.textContent = this.title;
            }
        }

        console.log( projects );
        //console.log( this );
            
    }
}
//Добавление Проектов
const PROJECTS_DATAS = [
    {
        title: 'Barley-Break',
        description: 'Classic game written in pure JS on HTML 5 Canvas.', 
        src: 'images/covers-projects/Barley-Break-cover.JPG', 
        gitLink: 'https://github.com/OVVosokor/Barley-Break',
        demolink: '',
        type: 'other'
    },
    {
        title: 'Barley-Break1',
        description: 'Classic game written in pure JS on HTML 5 Canvas. 1', 
        src: 'images/covers-projects/Barley-Break-cover.JPG', 
        gitLink: 'https://github.com/OVVosokor/Barley-Break',
        demolink: '',
        type: 'other'
    },
    {
        title: 'Barley-Break2',
        description: 'Classic game written in pure JS on HTML 5 Canvas. 2', 
        src: 'images/covers-projects/Barley-Break-cover.JPG', 
        gitLink: 'https://github.com/OVVosokor/Barley-Break',
        demolink: '',
        type: 'game'
    },
    {
        title: 'Barley-Break3',
        description: 'Classic game written in pure JS on HTML 5 Canvas. 3', 
        src: 'images/covers-projects/Barley-Break-cover.JPG', 
        gitLink: 'https://github.com/OVVosokor/Barley-Break',
        demolink: '',
        type: 'game'
    }

    
]

for ( const PROJECT_DATA of PROJECTS_DATAS ) {
    const PROJECT = new Project( PROJECT_DATA );
}
//console.log( PROJECTS_DATAS[2] );
/*----------------------------Popup------------------*/

const PAGE_POPUP = document.getElementById( 'page-popup' );
const LINKS_TO_VIEW_PROJECT = document.getElementsByClassName( 'item__description--content' );
const ELEMENT_MAIN = document.getElementById( 'page' );
const EXIT_BUTTON = document.getElementById( 'exit-button' );
const IMAGE_EXIT_BUTTON = new Image();
const IMAGE_EXIT_BUTTON_DEFAULT = new Image();

IMAGE_EXIT_BUTTON.src = 'images/button-exit-hover.svg';
IMAGE_EXIT_BUTTON_DEFAULT.src = 'images/button-exit-default.svg';

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
                PAGE_POPUP.style.top = window.scrollY + ( window.innerHeight - 550 ) / 2 + 'px';
                PAGE_POPUP.style.left = ( window.innerWidth - 800 ) / 2 + 'px';

                //console.log( PROJECT_TITLE, PROJECT_DESCRIPTION, PROJECT_IMAGE );
                
                //console.log( e.target.parentNode.parentNode.parentNode );
                const sourceElement = e.target.parentNode.parentNode.parentNode;
                const POPUP_TITLE = document.getElementById( 'project-title' );
                const POPUPT_DESCRIPTION = document.getElementById( 'project-description' );
                const POPUP_IMAGE = document.getElementById( 'project-image' );
                const POPUP_GIT_LINK = document.getElementById( 'git-link' );
                const POPUP_DEMO_LINK = document.getElementById( 'demo-link' );

                
                POPUP_TITLE.textContent = sourceElement.getAttribute( 'title' );
                POPUPT_DESCRIPTION.textContent = sourceElement.getAttribute( 'description' );
                POPUP_IMAGE.src = sourceElement.getAttribute( 'src' );
                POPUP_GIT_LINK.href = sourceElement.getAttribute( 'gitLink' );
                POPUP_DEMO_LINK.href = sourceElement.getAttribute( 'demoLink' );

                //console.log( sourceElement.getAttribute( 'id' ) );


                for ( const link of LINKS_TO_VIEW_PROJECT ) {
                    link.removeEventListener( 'click', clickLinksHandler, false );
                }

                EXIT_BUTTON.addEventListener( 'click', clickExitPopupHandler, false );
                EXIT_BUTTON.addEventListener( 'mouseover', mouseoverExitPopupHandler, false );
                EXIT_BUTTON.addEventListener( 'mouseout', mouseoverExitPopupHandler, false );

                setTimeout( () => {
                    ELEMENT_MAIN.addEventListener( 'click', clickExitPopupHandler, false )
                }, 500 );
            }
    //console.log(isActivePagePopup);
}

function mouseoverExitPopupHandler( e ) {
    if ( e.type === 'mouseover' ) {
        EXIT_BUTTON.src = IMAGE_EXIT_BUTTON.src;
    }else{
        EXIT_BUTTON.src = IMAGE_EXIT_BUTTON_DEFAULT.src;
    }
}

function clickExitPopupHandler() {
    isActivePagePopup = false;
    PAGE_POPUP.style.display = 'none';

    for ( const link of LINKS_TO_VIEW_PROJECT ) {
        link.addEventListener( 'click', clickLinksHandler, false );
    }

    ELEMENT_MAIN.removeEventListener( 'click', clickExitPopupHandler, false  )
}


if ( !isActivePagePopup ) {
    PAGE_POPUP.style.display = 'none';
}
