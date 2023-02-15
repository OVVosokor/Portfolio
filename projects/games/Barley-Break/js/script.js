const canvas = document.getElementById('myCanvas');
const buttonStart = document.getElementById('start');
const ctx = canvas.getContext('2d');
let mouseX ;
let mouseY ;
let clickX;
let clickY;
let dblclickX;
let dblclickY;
let isDblClick = false;
let isMouseDown = false;
let isBaseCursor = true;
let box16 = {};
let chosenX;
let chosenY;
let victoryBar = [];
let isStart = false;
let steps = 0;
let startTime;
let endTime;
let pausedTime = 0;
let isAnyKeyPressed = false;
let isAnyBlockMove = false;
let isPause = false;
//инициализируем
const boxes = [];
let shuffledArr=[];
let shuffledArrWithDisorders=[];
let typeOfDifficulty = {
    normal: true,
    hard: false
};

class Box {
    coords = {  x: 55, 
                y: 55,
                width:  70,
                height: 70
    };
    #id;
    isFocus = false;
    isChosen = false;
    visibility = true;
    indexRow;
    indexColumn;
    topBlock;
    bottomBlock;
    leftBlock;
    rightBlock;
    center = {};
    isCanMoveRight = false;
    isCanMoveLeft = false;
    isCanMoveTop = false;
    isCanMoveBottom = false;

    get center() {
        return this.center;
    }
    get id() {
        return this.#id;
    }
    set id( value ) {
        return this.#id = value;
    }
    //метод проверяет наведена ли мышь на блок
    isGetFocus() {
                if ( ( mouseX > this.coords.x - 35 && mouseX < this.coords.x  + 35 ) && ( mouseY > this.coords.y - 35  && mouseY < this.coords.y  + 35 ) ) {
                    return this.isFocus = true;
                }else {
                    return this.isFocus = false;
                }
    }
    // метод проверяет нажата ли клавиша мыши на блоке
    isDownMouseOnBox() {
        if ( isAnyBlockMove === false && isMouseDown === true && this.isFocus === true ) { 
            this.isChosen = true;

                if ( this.coords.x === 55 || this.coords.x === 130 || this.coords.x === 205 || this.coords.x === 280 ) {
                    chosenX = this.coords.x;
                }
                if ( this.coords.y === 55 || this.coords.y === 130 || this.coords.y === 205 || this.coords.y === 280 ) {
                    chosenY = this.coords.y;
                }
        }else{ 
            this.isChosen = false;
        }
    }
    isMoving() {
        if ( this.isCanMoveBottom === true || this.isCanMoveLeft === true || this.isCanMoveRight === true || this.isCanMoveTop === true ) {
            isAnyBlockMove = true;
        }
    }
    //проверка на пересечение со стенами
    testWalls() {
            if ( !( this.coords.x  < gameFrame.width - 24 ) ) {
                this.coords.x = Math.min( this.coords.x  , gameFrame.width - 25 ); // правая сторона
                } else if ( !( this.coords.x  > gameFrame.x + 4 ) ) {
                    this.coords.x = Math.max( this.coords.x ,  55 ); //левая сторона
                }
                if ( !( this.coords.y  < gameFrame.height - 24 ) ) {
                    this.coords.y = Math.min( this.coords.y, gameFrame.height - 25 );// правая сторона
                }else if ( !( this.coords.y  > gameFrame.y + 4 ) ) {
                    this.coords.y = Math.max( this.coords.y ,  55 ); //левая сторона
                }
    }
    //метод получения соседей
    getNeighbors() {
        let searchVector = 75;
        //поиск по Х координате
        for ( let i = 0; i < 2; i++ ) {
            if ( i === 1 ) {
                searchVector *= -1;
                //блок слева
                for ( let i = 1; i < 5; i++ ) {
                    for ( let j = 0; j < 5; j++ ) {
                        if ( boxes[i][j] !== undefined ) {
                            if ( ( boxes[i][j].coords.x <= this.center.x + searchVector 
                                    && boxes[i][j].coords.x + boxes[i][j].coords.width >= this.center.x + searchVector  ) 
                                    && boxes[i][j].coords.y === this.coords.y ) { //  if ( boxes[i][j].coords.x === this.coords.x + searchVector && boxes[i][j].coords.y === this.coords.y ) {
                                this.leftBlock = boxes[i][j];
                            }else if ( this.center.x + searchVector < gameFrame.x - 25 ) {
                                this.leftBlock = undefined;
                            }
                        }
                    }
                }
            }else{
                //блок справа
                for ( let i = 1; i < 5; i++ ) {
                    for ( let j = 0; j < 5; j++ ) {
                        if ( boxes[i][j] !== undefined ) {
                            if ( ( boxes[i][j].coords.x <= this.center.x + searchVector 
                                    && boxes[i][j].coords.x + boxes[i][j].coords.width >= this.center.x + searchVector  ) 
                                    && boxes[i][j].coords.y === this.coords.y ) {
                                this.rightBlock = boxes[i][j];
                            }else if ( this.center.x + searchVector > gameFrame.width + 75 ) {
                                this.rightBlock = undefined;
                            }
                        }
                    }
                }
            }
        }
        searchVector = 75;
        //поиск по Y координате
        for ( let i = 0; i < 2; i++ ) {
            if ( i === 1 ) {
                searchVector *= -1;
                //блок сверху
                for ( let i = 1; i < 5; i++ ) {
                    for ( let j = 0; j < 5; j++ ) {
                        if ( boxes[i][j] !== undefined ) {
                            if ( ( boxes[i][j].coords.y <= this.center.y + searchVector 
                                    && boxes[i][j].coords.y + boxes[i][j].coords.height >= this.center.y + searchVector ) 
                                    && boxes[i][j].coords.x === this.coords.x ) {
                                this.topBlock = boxes[i][j];
                            }else if ( this.center.y + searchVector < gameFrame.y - 25 ) {
                                this.topBlock = undefined;
                            }
                        }
                    }
                }

            }else{
                //блок снизу
                for ( let i = 1; i < 5; i++ ) {
                    for ( let j = 0; j < 5; j++ ) {
                        if ( boxes[i][j] !== undefined ) {
                            if ( ( boxes[i][j].coords.y <= this.center.y + searchVector 
                                    && boxes[i][j].coords.y + boxes[i][j].coords.height >= this.center.y + searchVector ) 
                                    && boxes[i][j].coords.x === this.coords.x ) {
                                this.bottomBlock = boxes[i][j];
                            }else if ( this.center.y + searchVector > gameFrame.height + 75 ) {
                                this.bottomBlock = undefined;
                            }
                        }
                    }
                }
            }
        }
    }
    //проверка на столкновения блоков
    testCollisionWithBlocks() {
        //проверка сверху
        if ( this.topBlock !== undefined ) {
            if ( this.topBlock.id !== 16 ) {
                if ( this.coords.y < this.topBlock.coords.y + this.topBlock.coords.height + 5 ) {
                    this.coords.y = Math.max( this.coords.y, this.topBlock.coords.y + this.topBlock.coords.height + 5);
                }
            }
        }
        //проверка снизу
        if ( this.bottomBlock !== undefined ) {
            if ( this.bottomBlock.id !== 16 ) {
                if ( this.coords.y > this.bottomBlock.coords.y - this.coords.height - 5 ) {
                    this.coords.y = Math.min( this.coords.y, this.bottomBlock.coords.y - this.coords.height - 5 );
                }
            }
        }
        //проверка слева
        if ( this.leftBlock !== undefined ) {
            if ( this.leftBlock.id !== 16 ) {
                if ( this.coords.x < this.leftBlock.coords.x + this.leftBlock.coords.width + 5 ) {
                    this.coords.x = Math.max( this.coords.x, this.leftBlock.coords.x + this.leftBlock.coords.width + 5);
                }
            }
        }
        //проверка справа
        if ( this.rightBlock !== undefined ) {
            if ( this.rightBlock.id !== 16 ) {
                if ( this.coords.x  > this.rightBlock.coords.x - this.coords.width - 5 ) {
                    this.coords.x = Math.min( this.coords.x, this.rightBlock.coords.x - this.coords.width - 5 );
                }
            }
        }
    }
    //доводка блока если центр больше 130 205 280 
    slideBlock() {
        let velocity = 3;

        if ( ( this.center.x >= 130  && this.center.x < 165 ) || ( this.center.x >= 205  && this.center.x < 240 ) || ( this.center.x >= 280  && this.center.x < 315 ) ) {
            this.coords.x += velocity;
        }
        if ( ( this.center.y >= 130 && this.center.y < 165 ) || ( this.center.y >= 205 && this.center.y < 240 ) || ( this.center.y >= 280 && this.center.y < 315 ) ) {
            this.coords.y += velocity;
        }
        if ( ( this.center.x > 90 && this.center.x < 130  ) || ( this.center.x > 165 && this.center.x < 205 ) || (  this.center.x > 240 && this.center.x < 280  ) ) {
            this.coords.x -= velocity;
        }
        if ( ( this.center.y > 90 && this.center.y < 130 ) || (  this.center.y > 165 && this.center.y < 205 ) || (  this.center.y > 240 && this.center.y < 280 ) ) {
            this.coords.y -= velocity;
        }
    }
    //движение блока по клику на край блока
    moveBlock() {
        let velocity = 5;

        //проверка возможности движения направо
        if ( this.isCanMoveRight === true ) {
            this.coords.x += velocity;

                if ( this.rightBlock === undefined || this.rightBlock.id !== 16 ) {
                    this.isCanMoveRight = false;
                    isDblClick = false;
                    dblclickX = undefined;
                    dblclickY = undefined;
                } 
        }else
        //проверка возможности движения налево
        if ( this.isCanMoveLeft === true ) {
            this.coords.x -= velocity;

                if ( this.leftBlock === undefined || this.leftBlock.id !== 16 ) {
                    this.isCanMoveLeft = false;
                    isDblClick = false;
                    dblclickX = undefined;
                    dblclickY = undefined;
                } 

        }else
        //проверка возможности движения вверх
        if ( this.isCanMoveTop === true ) {
            this.coords.y -= velocity;

            if ( this.topBlock === undefined || this.topBlock.id !== 16 ) {
                this.isCanMoveTop = false;
                isDblClick = false;
                dblclickX = undefined;
                dblclickY = undefined;
            }
        }else
        //проверка возможности движения вниз
        if ( this.isCanMoveBottom === true ) {
            this.coords.y += velocity;

            if ( this.bottomBlock === undefined || this.bottomBlock.id !== 16 ) {
                this.isCanMoveBottom = false;
                isDblClick = false;
                dblclickX = undefined;
                dblclickY = undefined;
            }
        }
        
    }

    draw() {
        if ( isStart === true ) {            
            this.center.x = this.coords.x + this.coords.width / 2;
            this.center.y = this.coords.y + this.coords.height / 2;
            this.getNeighbors();
            this.isMoving();
        
            if ( this.visibility === true ) {
                this.isGetFocus();
                this.isDownMouseOnBox();
                this.slideBlock();
                this.testCollisionWithBlocks();
                //выбор для перемещения по двойному клику
                if ( isStart === true && isDblClick === true && isPause === false ) {
                    //проверяем нажатие справа
                    if ( ( dblclickX > this.coords.x + 20 && dblclickX < this.coords.x + 35 ) && ( dblclickY > this.coords.y - 20 && dblclickY < this.coords.y + 20 ) ) {
                        if ( this.rightBlock !== undefined && this.rightBlock.id === 16 ) {
                            this.isCanMoveRight = true;
                            dblclickX = undefined;
                            dblclickY = undefined;
                        }
                    }else
                    //проверяем нажатие слева
                    if ( ( dblclickX > this.coords.x - 35 && dblclickX < this.coords.x - 20 ) && ( dblclickY > this.coords.y - 20 && dblclickY < this.coords.y + 20 ) ) {
                        if ( this.leftBlock !== undefined && this.leftBlock.id === 16 ) {
                            this.isCanMoveLeft = true;
                            dblclickX = undefined;
                            dblclickY = undefined;
                        }
                    }
                    else
                    //проверяем нажатие снизу
                    if ( ( dblclickY > this.coords.y + 20 && dblclickY < this.coords.y + 35 ) && ( dblclickX > this.coords.x - 20 && dblclickX < this.coords.x + 20 ) ) {
                        if ( this.bottomBlock !== undefined && this.bottomBlock.id === 16 ) {
                            this.isCanMoveBottom = true;
                            dblclickX = undefined;
                            dblclickY = undefined;
                        }
                    }else
                    //проверяем нажатие сверху
                    if ( ( dblclickY > this.coords.y - 35 && dblclickY < this.coords.y - 20 ) && ( dblclickX > this.coords.x - 20 && dblclickX < this.coords.x + 20 ) ) {
                        if ( this.topBlock !== undefined && this.topBlock.id === 16 ) { //( this.topBlock !== undefined )
                            this.isCanMoveTop = true;
                            dblclickX = undefined;
                            dblclickY = undefined;
                        }
                    }

                    this.moveBlock();
                }
                //выбор для перетаскивания
                if ( isStart === true && this.isChosen === true && isPause === false ) { 
                    //задаем активную часть блока для перетаскивания
                    if ( ( mouseX > this.coords.x - 20 && mouseX < this.coords.x + 20 ) && ( mouseY > this.coords.y - 20 && mouseY < this.coords.y + 20 ) ) { 
                        this.coords.x = mouseX;
                        this.coords.y = mouseY;
                    }
                
                    this.testWalls();
                    this.testCollisionWithBlocks();
                    //отрисовка
                    this.drawBlock();
                }else{
                    this.testWalls();
                    this.testCollisionWithBlocks();
                    //отрисовка
                    this.drawBlock();
                }
                
                this.drawGrabCursor();
                this.drawPointerArmCursor();
            }
        
            this.testWalls();
        } 
    }
    //метод отрисовки курсора для перетаскивания
    drawGrabCursor() {
        if ( isPause === false && isStart === true && ( mouseX > this.coords.x - 15 && mouseX < this.coords.x + 15 ) && ( mouseY > this.coords.y - 15 && mouseY < this.coords.y + 15 ) ) { 
            if ( ( this.rightBlock !== undefined && this.rightBlock.id === 16 ) || ( this.leftBlock !== undefined && this.leftBlock.id === 16 ) 
                || ( this.topBlock !== undefined && this.topBlock.id === 16 ) || ( this.bottomBlock !== undefined && this.bottomBlock.id === 16 ) ) {
                isBaseCursor = false;
                ctx.clearRect( grabArm, mouseX + 25, mouseY + 25, 50, 50 );
                ctx.drawImage( grabArm, mouseX + 31, mouseY + 33, 25, 25 );
            }else isBaseCursor = true;
        }
    }
    //метод отрисовки курсора выбора для двойного клика
    drawPointerArmCursor() {
        if ( isPause === false && isStart === true ) {
            //справа
            if ( ( mouseX > this.coords.x + 20 && mouseX < this.coords.x + 35 ) && ( mouseY > this.coords.y - 20 && mouseY < this.coords.y + 20 ) ) {
                if ( this.rightBlock !== undefined && this.rightBlock.id === 16 ) {
                        isBaseCursor = false;
                        this.drawPointerArm();
                }else isBaseCursor = true;
            }else 
            //слева
            if ( ( mouseX > this.coords.x - 35 && mouseX < this.coords.x - 20 ) && ( mouseY > this.coords.y - 20 && mouseY < this.coords.y + 20 ) ) {
                if ( this.leftBlock !== undefined && this.leftBlock.id === 16 ) {
                        isBaseCursor = false;
                        this.drawPointerArm();
                }else isBaseCursor = true;
            }else 
            //снизу
            if ( ( mouseY > this.coords.y + 20 && mouseY < this.coords.y + 35 ) && ( mouseX > this.coords.x - 20 && mouseX < this.coords.x + 20 ) ) {
                if ( this.bottomBlock !== undefined && this.bottomBlock.id === 16 ) {
                        isBaseCursor = false;
                        this.drawPointerArm();
                }else isBaseCursor = true;
            }else 
            //сверху
            if ( ( mouseY > this.coords.y - 35 && mouseY < this.coords.y - 20 ) && ( mouseX > this.coords.x - 20 && mouseX < this.coords.x + 20 ) ) {
                if ( this.topBlock !== undefined && this.topBlock.id === 16 ) {
                        isBaseCursor = false;
                        this.drawPointerArm();
                }else isBaseCursor = true;
            }
        }
    }
    //метод отрисовки руки-курсора
    drawPointerArm() {
        ctx.clearRect( pointerArm, mouseX + 30, mouseY + 32, 26, 26 );
        ctx.drawImage( pointerArm, mouseX + 31, mouseY + 33, 25, 25 );
    }
    //метод отрисовки блока
    drawBlock(){
        ctx.drawImage(imgBlock,  this.coords.x, this.coords.y, this.coords.width + 4, this.coords.height + 4 ); //this.coords.width + 4, this.coords.height + 4 

       // ctx.font = "12px serif";
        //ctx.strokeStyle = 'white';
        //ctx.lineWidth = 1;
        ctx.lineWidth = 2;
        ctx.font = "30px Moon Dance";
        ctx.strokeStyle = 'black';

        if ( this.#id !== 1 ) {
            ctx.strokeText(  `${ this.#id }`, this.coords.x + 30, this.coords.y + 45 );
        }
        if ( this.#id === 1 ) {
            ctx.strokeText(  `${ this.#id }`, this.coords.x + 35, this.coords.y + 45 );
        }
        ctx.clearRect( cursor, mouseX + 30, mouseY + 32, 26, 26 );

    }
        
}


class Game {
    #x = 50;
    #y = 50;
    #width = 305;
    #height = 305;
    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    get width() {
        return this.#width;
    }
    get height() {
        return this.#height;
    }

    drawCursor() {
        if ( isBaseCursor ) {
            ctx.clearRect( cursor, mouseX + 30, mouseY + 32, 26, 26 );
            ctx.drawImage( cursor, mouseX + 31, mouseY + 33, 25, 25 );
        }
    }
    drawPointerArm() {
        ctx.clearRect( pointerArm, mouseX + 24, mouseY + 32, 26, 26 );
        ctx.drawImage( pointerArm, mouseX + 25, mouseY + 33, 25, 25 );
    }
    //проверяем положение курсора и рисуем его
    getDrawPointerArm() {
        if ( isStart ) {
            //cursor for Restart
            if ( ( mouseX > 20 && mouseX < 38 ) && ( mouseY > -24 && mouseY < 2 ) ) {
                isBaseCursor = false;
                this.drawPointerArm();
            }else   
            //cursor for Pause 
            if ( isPause === false && ( mouseX > 48 && mouseX < 69 ) && ( mouseY > -24 && mouseY < 2 ) ) {
                isBaseCursor = false;
                this.drawPointerArm();
            }else             
            //cursor for Stop
            if ( isPause === false && ( mouseX > 80 && mouseX < 100 ) && ( mouseY > -24 && mouseY < 2 ) ) {
                isBaseCursor = false;
                this.drawPointerArm();
            }else isBaseCursor = true;

        }else 
        if ( isStart !== true ) {
            //cursor for button New Game
            if ( ( mouseX > 130 && mouseX < 210 ) && ( mouseY > 130 && mouseY < 155 ) ) {
                isBaseCursor = false;
                this.drawPointerArm();
            }else 
            //cursor for button Normal
            if ( ( mouseX > 121 && mouseX < 146 ) && ( mouseY > 217 && mouseY < 243 ) ) {
                isBaseCursor = false;
                this.drawPointerArm();
            }else
            //cursor for button Hard
            if ( ( mouseX > 193 && mouseX < 215 ) && ( mouseY > 217 && mouseY < 243 ) ) {
                isBaseCursor = false;
                this.drawPointerArm();
            }else isBaseCursor = true;

        }
    }
    drawElementsMenu() {
        ctx.drawImage( bg, 0, 0 );
        /*
        ctx.drawImage( button, 50, 5, 90, 40 );
        ctx.beginPath();
            ctx.font = "15px serif";
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            if ( isStart === true ) {
                ctx.strokeText(  `Reset`, 77, 29 );
            }
        ctx.closePath();
        */
        ctx.drawImage( button, 161, 5, 90, 40 );
        ctx.beginPath();
            ctx.font = "15px serif";
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            if ( endTime !== undefined ) {
                ctx.strokeText(  `timer: ${ endTime }`, 172, 29 ); //${ a }
            }else{
                ctx.strokeText(  `timer`, 188, 29 ); //${ a }
            }
        //ctx.closePath();

        ctx.drawImage( button, 270, 5, 90, 40 );
        //ctx.beginPath();
            //ctx.font = "15px serif";
            //ctx.strokeStyle = 'black';
           // ctx.lineWidth = 1;
            ctx.strokeText(  `steps: ${ steps }`, 290, 29 ); //${ a }
        ctx.closePath();
    }
    drawFrame() {
        ctx.drawImage( imgFrame, this.#x, this.#y, this.#width + 4, this.#height + 4 );
    }
    //проверка пересечения с 16 блоком и подсчет ходов
    testCollideWithBlock16() {
        let swapBox16 = {};
        //получаем индексы 16 блока
        for ( let i = 1; i < 5; i++ ) {
            for ( let j = 1; j < 5; j++ ) {
                if ( boxes[i][j].id === 16 ) {
                    box16.indexRow = i;
                    box16.indexColumn = j;
                    box16.id = 16;
                }
            }
        }
        //получаем координаты 16 блока
        for ( let i = 1; i < 5; i++ ) {
            for ( let j = 1; j < 5; j++ ) {
                if ( boxes[i][j].id === box16.id ) {
                    box16.x = boxes[i][j].coords.x;
                    box16.y = boxes[i][j].coords.y;
                }
            }
        }
        //получаем ссылку на 16 блок
        for ( let i = 1; i < 5; i++ ) {
            for ( let j = 1; j < 5; j++ ) {
                if ( boxes[i][j].id === 16 ) {
                    swapBox16 = boxes[i][j];
                    break;
                }
            }
        }
        //проверяем на столкновение и считаем ходы
        for ( let i = 1; i < 5; i++ ) {
            for ( let j = 1; j < 5; j++ ) {
                if ( boxes[i][j].coords.x === swapBox16.coords.x && boxes[i][j].coords.y === swapBox16.coords.y && boxes[i][j].id !== 16 ) {
                    if ( chosenX === 55 || chosenX === 130 || chosenX === 205 || chosenX === 280 ) { //чтобы не выскакивал за пределы нужных координат
                        boxes[ box16.indexRow ][ box16.indexColumn ].coords.x = chosenX;
                    }
                    if ( chosenY === 55 || chosenY === 130 || chosenY === 205 || chosenY === 280 ) {  //чтобы не выскакивал за пределы нужных координат
                        boxes[ box16.indexRow ][ box16.indexColumn ].coords.y = chosenY;
                    }
                    steps++;
                    if ( isAnyBlockMove === true ) {
                    isAnyBlockMove = false;
                    }
                }
            }
        }
    }

    drawStartWindow() {
        if ( isStart !== true ) {
            ctx.drawImage( startWindow, 0, 0, 410, 384 );
            ctx.drawImage( button, 155, 160, 100, 40 );
            ctx.beginPath();
                ctx.font = "15px serif";
                ctx.lineWidth = 1;
                if ( isStart === false ) {
                    ctx.strokeText(  `New Game`, 171, 183 );
                }
            //изменение кнопки выбора сложности
            if ( typeOfDifficulty.normal ) {
                ctx.drawImage( roundButton, 0, 0, 100, 100, 220, 250, 40, 40 );
            }else{
                ctx.drawImage( roundButton, 100, 0, 100, 100, 220, 250, 40, 40 );
            }
            if ( typeOfDifficulty.hard ) {
                ctx.drawImage( roundButton, 0, 0, 100, 100, 150, 250, 40, 40 );
            }else{
            ctx.drawImage( roundButton, 100, 0, 100, 100, 150, 250, 40, 40 );
            }
                ctx.font = "13px serif";
                ctx.strokeText(  `Normal`, 151, 245 );
                ctx.strokeText(  `Hard`, 225, 245 );
                ctx.font = "15px serif";
                ctx.strokeText(  `Choose difficulty`, 151, 220 );
            ctx.closePath();
        }
    }
    drawSPRButton() {
        if ( isStart ) {
            ctx.drawImage( startPauseResetButton, 50, 5, 90, 40 );
        }
    }
    drawPauseMenu() {
        if ( isPause && isStart ) {
            ctx.drawImage( button, 100, 170, 220, 90 );
            ctx.beginPath();
                ctx.font = "25px serif";
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.strokeText(  `Paused`, 170, 210 );
                ctx.font = "17px serif";
                ctx.strokeText(  `press Restart Button...`, 135, 227 );
            ctx.closePath();
        }
    }
    restartGame() {
        if ( ( clickX > 19 && clickX < 38 ) && ( clickY > -24 && clickY < 0 ) ) {
            if ( isStart === true && isPause === true ) {
                isPause = false;
                let now = new Date();
                startTime = now.getTime();
            }
        }
    }
    pauseGame() {
        if ( ( clickX > 48 && clickX < 70 ) && ( clickY > -24 && clickY < 0 ) ) {
            if (  isStart === true ) {
                isPause = true;
                pausedTime = endTime;
                clickX = undefined;
                clickY = undefined;
            }
        }
    }
    stopGame() {
        if ( ( clickX > 81 && clickX < 100 ) && ( clickY > -24 && clickY < 0 ) ) {
            if ( isPause === false && isStart === true ) {
                isStart = false;
            }
        }
    }
    //выбор сложности ( выбор типа перемешивания )
    chooseDifficulty() {
        if ( isStart !== true ) {
            if ( ( clickX > 121 && clickX < 146 ) && ( clickY > 217 && clickY < 243 ) ) {
                typeOfDifficulty.normal = true;
                typeOfDifficulty.hard = false;
            }else if ( ( clickX > 193 && clickX < 215 ) && ( clickY > 217 && clickY < 243 ) ) {
                typeOfDifficulty.normal = false;
                typeOfDifficulty.hard = true;
            }
        }
    }

    timer() {

        if ( isPause === false && isStart === true && isVictory() === false ) {
            let currentTime = new Date();
            endTime = Math.round( ( currentTime.getTime() - startTime ) / 1000 ) + pausedTime;
        }
    }
    draw() {
            this.drawCursor(); 
        if ( isStart === true ) {
            this.timer();
            this.drawElementsMenu();
            this.testCollideWithBlock16();
            this.drawFrame();
            this.drawSPRButton();
            this.stopGame();
            this.pauseGame();
            this.restartGame();
        }
            this.drawStartWindow();
            this.chooseDifficulty();

           //this.drawNumbers( box16.id, box16.x, box16.y )
        
    }
}

function mouseMoveHandler( e ) {
    mouseX = e.offsetX - 35;
    mouseY = e.offsetY - 35;
}

function mouseDownHandler( e ) {
    if ( e ) { 
        isMouseDown = true; 
    }
}

function mouseUpHandler( e ) {
    if ( e ) { 
        isMouseDown = false; 
        clickX = e.offsetX - 35;
        clickY = e.offsetY - 35;
    }
}

function mouseDblClickHandler( e ) {
    if ( isPause === false ) {
        dblclickX = e.offsetX - 35;
        dblclickY = e.offsetY - 35;
        isDblClick = true;
    }
}

function keyHandler() {
    isAnyKeyPressed = true;
}
//функция инициализации
function init() {
//создаем двумерный массив блоков
for ( let i = 1; i < 5; i++ ) {
    boxes[i] = new Box(  );
}
for ( let i = 1; i < 5; i++ ) {
    for ( let j = 1; j < 5; j++ )
    {
        boxes[i][j] = new Box(  );
    }
}

//задаем координаты
    for ( let i = 2; i <= 4; i++ ) {
    boxes[ 1 ][ i ].coords.x = boxes[ 1 ][ i - 1 ].coords.x + 75; //1й ряд  boxes[ряд][столбец]
    }
    for ( let j = 2; j <= 4; j++ ) {
        for ( let i = 2; i <= 4; i++ ) {
            boxes[ j ][ i ].coords.x = boxes[ j ][ i - 1 ].coords.x + 75;
        }
        for ( let i = 1; i <= 4; i++ ) {
            boxes[ j ] [i ].coords.y = boxes[ j - 1 ][ i ].coords.y + 75;
        }
    }

//задаем id блока
    for ( let i = 1; i < 5; i++ ) {
        boxes[1][i].id = i;
    }
    for ( let j = 2; j < 5; j++ ) {
        for ( let i = 1; i < 5; i++ ) {
            boxes[j][i].id = boxes[j-1][i].id + 4;
        }
    }
}
//получаем случайные числа 
function getRandomIntInclusive( min, max ) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//проверка на повторение в массиве
function overlapIndeces( id ,arr ) {
    for ( let i = 0; i < arr.length; i++ ) {
        if ( id === arr[i] ) {
            return true;
        } 
    }
    return false;
}
//получаем перемешанные индексы (без учета количества беспорядка)
function shuffledIndeces() {
        let id = getRandomIntInclusive( 1, 16 );
        if ( overlapIndeces( id, shuffledArr ) !== true ) {
            shuffledArr.push( id );
        }

    if ( shuffledArr.length === 16 ) {
        return shuffledArr;
    }
    return shuffledIndeces();
}
//получаем перемешанные индексы (с учетом ограничения количества беспорядка)
function shuffledIndecesWithLimitingAmountDisorder() {

    let id = getRandomIntInclusive( 1, 15 );
    if ( overlapIndeces( id, shuffledArrWithDisorders ) !== true ) {
        shuffledArrWithDisorders.push( id );
    }

    if ( shuffledArrWithDisorders.length === 15 ) {
        let counter = 0;

        shuffledArrWithDisorders.push( 16 );
        //проверка количества беспорядка
        for ( let i = 0; i < shuffledArrWithDisorders.length; i ++ ) {
            if ( shuffledArrWithDisorders[ i ] > shuffledArrWithDisorders[ i + 1 ] ) {
                counter++;
            }
        }
        if ( counter % 2 !== 0 ) {
            shuffledArrWithDisorders = [];
            return shuffledIndecesWithLimitingAmountDisorder();
        }
        return shuffledArrWithDisorders;
    }
    return shuffledIndecesWithLimitingAmountDisorder();
}

//перемешивание в матрице
function shuffleBlocks( arr, isStart ) {
    let counter = 0;
    if ( isStart === true ) {
        for ( let i = 1; i < 5; i++ ) {
            for ( let j = 1; j < 5; j++ ) {
                boxes[i][j].id = arr[counter];
                boxes[i][j].visibility = true;
                counter++;
            }
        }
    }

    //удаляем 16 элемент
    for ( let i = 1; i < 5; i++ ) {
        for ( let j = 1; j < 5; j++ ) {
            if ( boxes[i][j].id === 16 ) {
                boxes[i][j].visibility = false;
            }
        }
    }
}
//функция рисования блоков
function drawBlocks() {
    for ( let i = 1; i < 5; i++ ) {
        for ( let j = 1; j < 5; j++ ) {
                if ( boxes[i][j] !==undefined ) {
                    boxes[i][j].draw();
                }
            }
    }
}
//проверка на выигрыш
function isVictory() { 
    let arr = [];
    for ( let i = 1; i < 5; i++ ) {
        for ( let j = 1; j < 5; j++ ) {
            for ( let i = 1; i < 5; i++ ) {

                if ( boxes[i][j].coords.x === 55 && boxes[i][j].coords.y === 55 && boxes[i][j].id === 1 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 130 && boxes[i][j].coords.y === 55 && boxes[i][j].id === 2 ) {
                    arr.push( 'true' );
                }else  if ( boxes[i][j].coords.x === 205 && boxes[i][j].coords.y === 55 && boxes[i][j].id === 3 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 280 && boxes[i][j].coords.y === 55 && boxes[i][j].id === 4 ) {
                    arr.push( 'true' );

                }else if ( boxes[i][j].coords.x === 55 && boxes[i][j].coords.y === 130 && boxes[i][j].id === 5 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 130 && boxes[i][j].coords.y === 130 && boxes[i][j].id === 6 ) {
                    arr.push( 'true' );
                }else  if ( boxes[i][j].coords.x === 205 && boxes[i][j].coords.y === 130 && boxes[i][j].id === 7 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 280 && boxes[i][j].coords.y === 130 && boxes[i][j].id === 8 ) {
                    arr.push( 'true' );

                }else if ( boxes[i][j].coords.x === 55 && boxes[i][j].coords.y === 205 && boxes[i][j].id === 9 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 130 && boxes[i][j].coords.y === 205 && boxes[i][j].id === 10 ) {
                    arr.push( 'true' );
                }else  if ( boxes[i][j].coords.x === 205 && boxes[i][j].coords.y === 205 && boxes[i][j].id === 11 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 280 && boxes[i][j].coords.y === 205 && boxes[i][j].id === 12 ) {
                    arr.push( 'true' );

                }else if ( boxes[i][j].coords.x === 55 && boxes[i][j].coords.y === 280 && boxes[i][j].id === 13 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 130 && boxes[i][j].coords.y === 280 && boxes[i][j].id === 14 ) {
                    arr.push( 'true' );
                }else  if ( boxes[i][j].coords.x === 205 && boxes[i][j].coords.y === 280 && boxes[i][j].id === 15 ) {
                    arr.push( 'true' );
                }else if ( boxes[i][j].coords.x === 280 && boxes[i][j].coords.y === 280 && boxes[i][j].id === 16 ) {
                    arr.push( 'true' );

                }else  arr.push( 'false' );
                
            }
        }
    }
    //console.log( arr );
    for ( let i = 0; i < 16; i++ ) {
        victoryBar[i] = arr[i];
    }
    //console.log( victoryBar );

    
    if (  victoryBar.includes( 'false' ) ) {
        //console.log( victoryBar );
        return false;
    }else{
        return true;
    }

}
//функция победы
function checkVictory() {
    if ( isVictory() === true && isStart === true ) {
        ctx.drawImage( button, 100, 170, 220, 90 );
        ctx.beginPath();
            ctx.font = "25px serif";
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeText(  `You Win!`, 165, 210 );
            ctx.font = "17px serif";
            ctx.strokeText(  `press any key...`, 165, 230 );
        ctx.closePath();
        if ( isAnyKeyPressed === true ) {
            document.location.reload();
        }
    }
}
function drawVictoryBar() {
    if ( isStart ) {    
        let counter = 0;
        for ( let i = 0; i < victoryBar.length; i++ ) {
            if ( victoryBar[i] === 'true' ) {
                counter++;
            }
        }
        let k = counter * (100 / 16) / 100;
        ctx.beginPath();
            ctx.fillStyle = 'green'; 
            if ( k !== 0 ) {
                ctx.rect( gameFrame.x, gameFrame.y + 320, gameFrame.width * k - 5, 10 );
            }else{
                ctx.rect( gameFrame.x, gameFrame.y + 320, gameFrame.width * k, 10 );
            }
            ctx.fill();
        //ctx.closePath();
       // ctx.beginPath();
            ctx.strokeStyle = 'black'; 
            ctx.lineWidth = 1;
            ctx.strokeRect( gameFrame.x, gameFrame.y + 320, gameFrame.width - 5, 10 );
        ctx.closePath();
    }
}
//start/reset game 
function startGame() {
    if ( isStart === false && ( clickX > 130 && clickX < 210 ) && ( clickY > 130 && clickY < 155 ) ) {
        isStart = true;
    
        shuffledIndeces();
        shuffledIndecesWithLimitingAmountDisorder();

        if ( typeOfDifficulty.normal === true ) {
            shuffleBlocks( shuffledArrWithDisorders, isStart );

        }else if ( typeOfDifficulty.hard === true ) {
            shuffleBlocks( shuffledArr, isStart );
        }
        clickX = undefined;
        clickY = undefined;
        shuffledArr = [];
        shuffledArrWithDisorders = [];
        steps = 0;
        pausedTime = 0;
        let now = new Date();
        startTime = now.getTime();
    }
}

//функция рисования экрана
function drawScreen() {
    ctx.clearRect( 0, 0, canvas.clientWidth, canvas.clientHeight );
    startGame();

    gameFrame.draw();
    drawBlocks(); 
    drawVictoryBar();
    gameFrame.drawPauseMenu();
    gameFrame.drawCursor();
    gameFrame.getDrawPointerArm();

    checkVictory();

    window.requestAnimationFrame( drawScreen );
}

//слушатели событий
    canvas.addEventListener( 'mousemove', mouseMoveHandler );
    canvas.addEventListener( 'mousedown', mouseDownHandler );
    canvas.addEventListener( 'mouseup', mouseUpHandler );
    canvas.addEventListener( 'dblclick', mouseDblClickHandler );
    document.addEventListener( 'keypress', keyHandler );
/*----------------------------------------------------------------*/
    const gameFrame = new Game();

    const imgBlock = new Image();
    imgBlock.src = 'images/block.png'; 

    const imgFrame = new Image();
    imgFrame.src = 'images/frame.png';

    const cursor = new Image();
    cursor.src = 'images/cursor.png';

    const button = new Image();
    button.src = 'images/button.png';

    const bg = new Image();
    bg.src = 'images/bg.png';

    const pointerArm = new Image();
    pointerArm.src = 'images/cursor-pointer-arm.png';

    const grabArm = new Image();
    grabArm.src = 'images/grab-Arm.png';

    const startWindow = new Image();
    startWindow.src = 'images/start-window.png';

    const roundButton = new Image();
    roundButton.src = 'images/round-buttons.png';

    const startPauseResetButton = new Image();
    startPauseResetButton.src = 'images/start-pause-reset-buttons.png';

    init();
    shuffleBlocks( shuffledArr, isStart );


    drawScreen(); //запуск игры (отрисовки)

