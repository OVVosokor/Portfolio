window.addEventListener( "load", eventWindowLoaded, false );

function eventWindowLoaded () {
    canvasApp();
    }

function canvasSupport () {
    return Modernizr.canvas;
    }

function canvasApp()  {

    if ( !canvasSupport() ) {
        return;
    }

    const canvas = document.getElementById( 'myCanvas' );
    const ctx = canvas.getContext( '2d' );

    const canvasUI = document.getElementById( 'myCanvas_ui' );
    const ctxUI = canvasUI.getContext( '2d' );

    const canvasBG = document.getElementById( 'myCanvas_bg' );
    const ctxBG = canvasBG.getContext( '2d' );

    let mouseMoveCoords = {
        x: 0,
        y: 0
    };
    let mouseClickCoords = {
        x: 0,
        y: 0
    };

    class Game {
        coords = {
            x: 0,
            y: 0
        };
        size = {
            width: 430,
            height: 440
        };
        playerFirst = {
            color: 'red',
            isActive: false,
            isTurned: false
        }
        playerSecond = {
            color: 'blue',
            isActive: false,
            isTurned: false,
            isPlayerPC: false
        }
        tokens = [];
        isInit = false;
        isStart = false;
        isVictory = false;
        isDeadHeat = false;
        isChooseColor = false;
        isChooseModePvP = false;
        isChooseModePvE = false;
        #isRedrawUI = false;
        isRedrawToggleButton = false;
        isEmpty = true;

        startTime;
        endTime;
        #start = new Path2D();
        #stop = new Path2D();
        #chooseColorFirst = new Path2D();
        #chooseColorSecond = new Path2D();
        #activeColor = new Path2D();
        #toggle = new Path2D();
        #chooseModePvP = new Path2D();
        #chooseModePvE = new Path2D();
        lastTokenOfFirstPlayer = {};
        lastTokenOfSecondPlayer = {};
        #pauseStart = undefined;
        #isFirstTurnPC = false;
        preferredAngles = undefined;

        //первичная инициализация
        init() {
            for ( let i = 0; i < 6; i++ ) {
                this.tokens[i] = new Token();
                for ( let j = 0; j < 7; j++ ) {
                        this.tokens[i][j] = new Token();
                    }
            }
            this.setCoordsTokens();
            this.setClickableStatusOnInit();
            this.startTime = new Date().getTime();
            this.drawBackGround();
        }

        initDrawTokens() {
            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                        this.tokens[i][j].initDrawToken();
                    }
            }
        }

        timer() {
            if ( this.isStart && !this.isVictory ) {
                const currentTime = new Date().getTime();
                this.endTime =  Math.round( ( currentTime - this.startTime) / 100 ) ;
            }
        }
        //пауза для методов
        timerPause( deltaPause ) {
            let delta;

            if ( this.#pauseStart !== undefined ) {
                const pauseEnd = new Date().getTime();
                delta =  Math.round( ( pauseEnd - this.#pauseStart) / 1000 ) ;
            }

            if ( this.#pauseStart === undefined ) {
                this.#pauseStart = new Date().getTime(); //старт функции
            }   

            if ( delta === deltaPause ) {
                this.#pauseStart = undefined;
                return true;
            }else{
                return false;
            }
        }
        //установка координат
        setCoordsTokens() {
            let x = 0;
            let y = 0;
            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                    this.tokens[i][j].coords.x = x;
                    this.tokens[i][j].coords.y = y;
                    x += 60
                }
                x = 0
                y += 60
            }
        
            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                    this.tokens[i][j].center.x = game.coords.x + 35 + this.tokens[i][j].coords.x ;
                    this.tokens[i][j].center.y = game.coords.y + 100 + this.tokens[i][j].coords.y ;
                }
            }
        }
        setClickableStatusOnInit() {
            for ( let i = 0; i < 7; i++ ) {
                this.tokens[ 5 ][ i ].isClickable = true;
            }
        }
        //метод отрисовки токенов
        drawTokens() {
            if ( this.isStart ) {
                for ( let i = 0; i < 6; i++ ) {
                    for ( let j = 0; j < 7; j++ ) {
                        this.tokens[i][j].drawToken();
                    }
                }
            }
        }
        //draw Menu
        drawStartMenu() {
            if ( !this.isStart ) {
                ctx.clearRect( (this.coords.x + this.size.width) / 2 - 25, (this.coords.y + this.size.height ) / 2 - 48, 60, 30 );

                this.#start.roundRect( (this.coords.x + this.size.width) / 2 - 30, (this.coords.y + this.size.height ) / 2 - 53, 60, 30, [10] );
                ctx.fillStyle = 'pink';
                ctx.fill(this.#start);
                ctx.stroke(this.#start);

                ctx.lineWidth = 2;
                ctx.font = "30px Moon Dance";
                ctx.strokeStyle = 'black';
                ctx.strokeText(  `Play`, (this.coords.x + this.size.width) / 2 - 22, (this.coords.y + this.size.height ) / 2 - 30 );
            }
        }
        //start Button
        playButton() {
            //отрисовка выбора режима
            if ( ( !this.isChooseModePvP && !this.isChooseModePvE ) && ctx.isPointInPath( this.#start, mouseClickCoords.x, mouseClickCoords.y ) ) {
                ctx.clearRect( this.coords.x + 150, this.coords.y + 210, 140, 110 ); ////!!!!

                ctx.lineWidth = 1;
                ctx.font = "20px Serif";
                ctx.strokeStyle = 'black';
                ctx.strokeText(  `Choose mode:`, this.coords.x + 160, this.coords.y + 230 );

                this.#chooseModePvP.roundRect( this.coords.x + 160, this.coords.y + 245, 120, 30, [ 20 ] );
                ctx.lineWidth = 1.5;
                ctx.strokeText( `P v P`, this.coords.x + 200, this.coords.y + 265 );

                this.#chooseModePvE.roundRect( this.coords.x + 160, this.coords.y + 284, 120, 30, [ 20 ] );
                ctx.strokeText( `P v PC`, this.coords.x + 192, this.coords.y + 305 );

                ctx.stroke( this.#chooseModePvP );
                ctx.stroke( this.#chooseModePvE );

                ctx.lineWidth = 1;
            }
            if ( this.#chooseModePvP && this.#chooseModePvE ) {
            //установка режима
            if ( ctx.isPointInPath( this.#chooseModePvP, mouseClickCoords.x, mouseClickCoords.y ) ) {
                this.isChooseModePvP = true;
                this.isChooseModePvE = false;
                this.playerSecond.isPlayerPC = false;
                
                mouseClickCoords.x = undefined;
                mouseClickCoords.y = undefined;

                ctx.clearRect( this.coords.x + 150, this.coords.y + 210, 140, 110 ); 

                this.#chooseModePvE = undefined;
                this.#chooseModePvP = undefined;
                
            }else
                if ( ctx.isPointInPath( this.#chooseModePvE, mouseClickCoords.x, mouseClickCoords.y ) ) {
                    this.isChooseModePvP = false;
                    this.isChooseModePvE = true;
                    this.playerSecond.isPlayerPC = true;

                    mouseClickCoords.x = undefined;
                    mouseClickCoords.y = undefined;

                    ctx.clearRect( this.coords.x + 150, this.coords.y + 210, 140, 110 ); 

                    this.#chooseModePvE = undefined;
                    this.#chooseModePvP = undefined;

                }
            }
            //выбор цвета
            if ( ( this.isChooseModePvP || this.isChooseModePvE ) && !this.isChooseColor  ) {
                ctx.clearRect( 17, 214, 248, 25 );

                ctx.lineWidth = 1;
                ctx.font = "20px Serif";
                ctx.strokeStyle = 'black';
                ctx.strokeText(  `Player 1 choose color`, this.coords.x + 20, this.coords.y + 230 );

                ctx.fillStyle = 'red';
                this.#chooseColorFirst.rect( this.coords.x + 200, this.coords.y + 215, 20, 20 );
                ctx.fill( this.#chooseColorFirst );
                ctx.stroke( this.#chooseColorFirst );

                ctx.fillStyle = 'blue';
                this.#chooseColorSecond.rect( this.coords.x + 240, this.coords.y + 215, 20, 20 );
                ctx.fill( this.#chooseColorSecond );
                ctx.stroke( this.#chooseColorSecond );
                
            }
            //установка цвета
            if ( !this.isStart ) {        
                    if ( ctx.isPointInPath( this.#chooseColorFirst, mouseClickCoords.x, mouseClickCoords.y ) ) {

                    this.playerFirst.color = 'red';
                    this.playerSecond.color = 'blue';

                    this.playerFirst.isActive = true;
                    this.playerSecond.isActive = false;

                    this.isChooseColor = true;
                    this.isStart = true;

                    this.#isRedrawUI = true

                    mouseClickCoords.x = undefined;
                    mouseClickCoords.y = undefined;
                    this.#start = undefined;
                    this.#chooseColorFirst = undefined;
                    this.#chooseColorSecond = undefined;
                    
                    ctx.clearRect( 0, 0, canvas.clientWidth, canvas.clientHeight );

                    this.initDrawTokens();
                }else 
                    if ( ctx.isPointInPath( this.#chooseColorSecond, mouseClickCoords.x, mouseClickCoords.y ) ) {
                        
                        this.playerFirst.color = 'blue';
                        this.playerSecond.color = 'red';

                        this.playerFirst.isActive = true;
                        this.playerSecond.isActive = false;

                        this.isChooseColor = true;
                        this.isStart = true;

                        this.#isRedrawUI = true

                        mouseClickCoords.x = undefined;
                        mouseClickCoords.y = undefined;
                        this.#start = undefined;
                        this.#chooseColorFirst = undefined;
                        this.#chooseColorSecond = undefined;

                        ctx.clearRect( 0, 0, canvas.clientWidth, canvas.clientHeight );

                        this.initDrawTokens();
                    }
            }    
        }
        //stop button
        stopButton() {
            if ( ctx.isPointInPath( this.#stop, mouseClickCoords.x, mouseClickCoords.y ) ) {
                mouseClickCoords.x = undefined;
                mouseClickCoords.y = undefined;

                document.location.reload();
            }
        }
        //отрисовка меню
        drawUI() {
            if ( this.isVictory ) {
                this.#isRedrawUI = true;
            }

            if ( this.isStart && this.#isRedrawUI ) {
                //кнопка Stop/Reset
                ctxUI.clearRect( this.coords.x + 40, this.coords.y + 27, 340+0, 40 );

                this.#stop.rect( this.coords.x + 40, this.coords.y + 27, 60, 30 );
                ctxUI.fillStyle = 'pink'
                ctxUI.fill( this.#stop );
                ctxUI.stroke( this.#stop );
                ctxUI.lineWidth = 2;
                ctxUI.font = "30px Moon Dance";
                ctxUI.strokeStyle = 'black';
                if ( this.isVictory ) {
                    ctxUI.strokeText(  `Reset`, this.coords.x + 45, this.coords.y + 50 );
                }else{
                    ctxUI.strokeText(  `Stop`, this.coords.x + 50, this.coords.y + 50 );
                }

                //ход первого игрока
                if ( this.playerFirst.isActive ) {
                    ctxUI.lineWidth = 1;
                    ctxUI.font = "22px Serif";
                    
                    if ( this.isChooseModePvP ) {
                        ctxUI.strokeText(  `P v P`, this.coords.x + 120, this.coords.y + 50 );
                    }else 
                        if ( this.isChooseModePvE ) {
                            ctxUI.strokeText(  `P v PC`, this.coords.x + 110, this.coords.y + 50 );
                        }
                        ctxUI.font = "24px Moon Dance";
                        ctxUI.strokeStyle = 'black';

                    if ( !this.isDeadHeat ) {
                            if ( this.isVictory ) {
                            ctxUI.strokeText(  `Player 1 is WIN!!!`, this.coords.x + 178, this.coords.y + 50 );
                        }else{
                            ctxUI.strokeText(  `Player 1, your turn...`, this.coords.x + 180, this.coords.y + 50 );
                            if ( !this.playerSecond.isPlayerPC ) {
                                ctxUI.clearRect( this.coords.x + 378, this.coords.y + 25, 40, 40 );
                            }
                        }
                    }else
                    if ( this.isDeadHeat ) {
                        ctxUI.strokeText(  `Dead Heat!!!`, this.coords.x + 178, this.coords.y + 50 );
                    }

                    ctxUI.lineWidth = 5;
                    this.#activeColor.arc( this.coords.x + 355,this.coords.y + 45, 15,0, Math.PI *2 );
                    ctxUI.fillStyle = this.playerFirst.color; // цвет заливки
                    ctxUI.stroke( this.#activeColor );
                    ctxUI.fill( this.#activeColor );
                    ctxUI.lineWidth = 1;

                    this.#isRedrawUI = false;

                }else 
                //ход второго игрока ( ПК )
                    if ( this.playerSecond.isActive ) {
                        ctxUI.lineWidth = 1;
                        
                        ctxUI.lineWidth = 1;
                        ctxUI.font = "22px Serif";

                        if ( this.isChooseModePvP ) {
                            ctxUI.strokeText(  `P v P`, this.coords.x + 120, this.coords.y + 50 );
                        }else 
                            if ( this.isChooseModePvE ) {
                                ctxUI.strokeText(  `P v PC`, this.coords.x + 110, this.coords.y + 50 );
                            }
                            ctxUI.font = "24px Moon Dance";
                            ctxUI.strokeStyle = 'black';
        
                        if ( !this.isDeadHeat ) {
                            if ( this.isVictory ) {
                                if ( this.isChooseModePvE ) {
                                    ctxUI.strokeText(  `PC is WIN!!!`, this.coords.x + 178, this.coords.y + 50 );
                                }else
                                if ( this.isChooseModePvP ) {
                                    ctxUI.strokeText(  `Player 2 is WIN!!!`, this.coords.x + 178, this.coords.y + 50 );
                                }
                            }else{
                                if ( this.isChooseModePvE ) {
                                    ctxUI.strokeText(  `PC, your turn...`, this.coords.x + 180, this.coords.y + 50 );
                                    ctxUI.clearRect( this.coords.x + 378, this.coords.y + 25, 40, 40 );
                                }else
                                    if ( !this.isChooseModePvE ) {
                                        ctxUI.strokeText(  `Player 2, your turn...`, this.coords.x + 180, this.coords.y + 50 );
                                        ctxUI.clearRect( this.coords.x + 378, this.coords.y + 25, 40, 40 );
                                    }
                            }
                        }else
                            if ( this.isDeadHeat ) {
                                ctxUI.strokeText(  `Dead Heat!!!`, this.coords.x + 178, this.coords.y + 50 );
                            }
                        ctxUI.lineWidth = 5;
                        this.#activeColor.arc( this.coords.x + 355, this.coords.y + 45, 15,0, Math.PI *2 );
                        ctxUI.fillStyle = this.playerSecond.color; // цвет заливки
                        ctxUI.stroke( this.#activeColor );
                        ctxUI.fill( this.#activeColor );
                        ctxUI.lineWidth = 1;

                        this.#isRedrawUI = false;
                    }
            }
        }
        //кнопка завершения хода
        toggleButton() {
            if ( this.isRedrawToggleButton && this.isStart && !this.isVictory && ( this.playerFirst.isTurned || this.playerSecond.isTurned ) ) {
                
                if ( !this.playerSecond.isPlayerPC && ( this.playerFirst.isTurned || this.playerSecond.isTurned ) ) {
                    ctxUI.clearRect( this.coords.x + 378, this.coords.y + 25, 35, 35 );

                    this.#toggle.roundRect( this.coords.x + 383, this.coords.y + 30, 30, 30, [10] );
                    ctxUI.stroke(this.#toggle);
        
                    ctxUI.lineWidth = 2;
                    ctxUI.font = "30px Moon Dance";
                    ctxUI.strokeStyle = 'black';
                    ctxUI.strokeText( `>>`, this.coords.x + 388, this.coords.y + 52 );
                    this.isRedrawToggleButton = false;

                }
                if ( this.playerSecond.isPlayerPC && this.playerFirst.isTurned ) {

                    this.#toggle.roundRect( this.coords.x + 383, this.coords.y + 30, 30, 30, [10] );
                    ctxUI.stroke(this.#toggle);
        
                    ctxUI.lineWidth = 2;
                    ctxUI.font = "30px Moon Dance";
                    ctxUI.strokeStyle = 'black';
                    ctxUI.strokeText( `>>`, this.coords.x + 388, this.coords.y + 52 );
                    this.isRedrawToggleButton = false;

                }
            }
                if ( ctxUI.isPointInPath( this.#toggle, mouseClickCoords.x, mouseClickCoords.y ) ) {

                    this.#isRedrawUI = true;

                    if ( this.playerFirst.isActive && game.playerFirst.isTurned ) {
                        this.playerFirst.isActive = false;
                        this.playerSecond.isActive = true;
                        game.playerFirst.isTurned = false;
                    }else
                        if ( this.playerSecond.isActive && game.playerSecond.isTurned ) {
                            this.playerFirst.isActive = true;
                            this.playerSecond.isActive = false;
                            game.playerSecond.isTurned = false;
                        }
                    mouseClickCoords.x = undefined;
                    mouseClickCoords.y = undefined;
                }else 
                    if ( this.isChooseModePvE && !this.isVictory ) {

                        this.#isRedrawUI = true;

                        if ( this.playerSecond.isActive && game.playerSecond.isTurned ) {
                            this.playerFirst.isActive = true;
                            this.playerSecond.isActive = false;
                            game.playerSecond.isTurned = false;
                        }
                    }
            
        }
        //метод - ход ПК
        turnPC() {
            if ( this.isEmptyCells() ) {

            if ( this.isStart && this.isChooseModePvE && this.playerSecond.isActive && !this.playerSecond.isTurned ) {
                //первый ход
                if ( !this.#isFirstTurnPC ) {
                    let swapTokens = [];

                    let r = 60;
                    let x, y;
                    //массив из которых выбирать случайно один для первого хода
                    for ( let i = 0; i < 6; i++ ) {
                        for ( let j = 0; j < 7; j++ ) {
                            if ( this.tokens[ i ][ j ] !== this.lastTokenOfFirstPlayer ) {                       
                                for ( let angle = 0; angle < 360; angle += 45 ) {
                                    x = r * Math.cos( angle * Math.PI / 180 );
                                    y = r * Math.sin( angle * Math.PI / 180 );
                                    if ( ctx.isPointInPath( this.lastTokenOfFirstPlayer.circle, this.tokens[ i ][ j ].center.x + x, this.tokens[ i ][ j ].center.y + y ) && 
                                                                                                                            this.tokens[ i ][ j ].isClickable && 
                                                                                                                            this.tokens[ i ][ j ].color === '' ) {
                                        swapTokens.push( this.tokens[ i ][ j ] );
                                    }
                                }
                            }
                        }
                    }
                    //получаем случайный индекс
                    const index =  Math.floor( Math.random() * ( swapTokens.length - 1 ) );
                    const swapToken = swapTokens[ index ];
                    //пауза
                    const  flag = this.timerPause( 2 );
                    if ( flag ) {
                        swapToken.isActive = true;
                        swapToken.isRedrawToken = true;
                        swapToken.color = this.playerSecond.color;
                        this.playerSecond.isTurned = true;
                        swapToken.setNeighborsClickableStatus();
                        this.#isFirstTurnPC = true;
                        swapToken.getVictory();
                        this.lastTokenOfSecondPlayer = swapToken;
                    }
                }else{
                    //не первый ход
                    let swapAngle = 0;

                    swapAngle =  this.getAnglesToMovePC();
                    this.preferredAngles = this.getPrefferedAngleToMovePC();
                    const contraToken = this.getAltTokenToTurnPC( 'contra' );

                    if ( contraToken === undefined ) {
                        if ( swapAngle === undefined ) { //если пустых ячеек нет
                            let altToken = this.getAltTokenToTurnPC( 'altTurn' );

                            if ( altToken === undefined ) {
                                //если ничего не нашли, выбираем случайно
                                let swapTokens = [];
                                //находим все кликабельные
                                for ( let i = 0; i < 6; i++ ) {
                                    for ( let j = 0; j < 7; j++ ) {
                                        if ( game.tokens[i][j].isClickable === true && game.tokens[i][j].color === '' ) { 
                                            swapTokens.push( game.tokens[ i ][ j ] );
                                        }
                                    }
                                }
                                //получаем случайный индекс
                                const index =  Math.floor( Math.random() * ( swapTokens.length - 1 ) );
                                altToken = swapTokens[ index ];
                                
                                /*
                                if ( swapTokens.length !== 0 ) {
                                    //получаем случайный индекс
                                    const index =  Math.floor( Math.random() * ( swapTokens.length - 1 ) );
                                    altToken = swapTokens[ index ];
                                }else
                                    //если ничья
                                    if ( swapTokens.length === 0 ) {

                                        console.log( swapTokens, swapTokens.length );

                                        this.isDeadHeat = true;
                                    }
                                */

                            }
                            //пауза
                            const  flag = this.timerPause( 2 );
                            if ( flag ) {
                                altToken.isActive = true;
                                altToken.isRedrawToken = true;
                                altToken.color = this.playerSecond.color;
                                this.playerSecond.isTurned = true;
                                altToken.setNeighborsClickableStatus();
                                this.#isFirstTurnPC = true;
                                altToken.getVictory();
                                this.lastTokenOfSecondPlayer = altToken;
                            }
                        }else
                            //если в массиве больше двух выбираем случайно
                            //получаем случайный индекс
                            if ( this.preferredAngles.length >= 2 ) {
                                    const index =  Math.floor( Math.random() * ( this.preferredAngles.length - 1 ) );
                                    swapAngle = Number( this.preferredAngles[ index ] );
                                }else
                                    if ( this.preferredAngles.length === 1 ) {
                                        swapAngle = Number( this.preferredAngles[ 0 ] );
                                }
                            let r = 60;
                            let x, y;
                            //находим фишку с учетом угла и положения последней фишки 2го игрока
                            loop3:
                            for ( let i = 0; i < 6; i++ ) {
                                for ( let j = 0; j < 7; j++ ) {
                                    if ( game.tokens[ i ][ j ] !== this.lastTokenOfSecondPlayer ) {    
                                        if ( swapAngle % 2 === 0 ) {
                                            r = 60;
                                        }else
                                            if ( swapAngle % 2 !== 0 ) {
                                                r = 85;
                                            }
        
                                        x = r * Math.cos( swapAngle * Math.PI / 180 );
                                        y = r * Math.sin( swapAngle * Math.PI / 180 );
                                        if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + x, this.lastTokenOfSecondPlayer.center.y + y ) && game.tokens[ i ][ j ].color === '' ) {
                                            //пауза
                                            const  flag = this.timerPause( 2 );
        
                                            if ( flag ) {
                                                this.preferredAngles = [];
                                                game.tokens[ i ][ j ].isActive = true;
                                                game.tokens[ i ][ j ].isRedrawToken = true;
                                                game.tokens[ i ][ j ].color = this.playerSecond.color;
                                                this.playerSecond.isTurned = true;
                                                game.tokens[ i ][ j ].setNeighborsClickableStatus();
                                                this.#isFirstTurnPC = true;
                                                game.tokens[ i ][ j ].getVictory();
                                                this.lastTokenOfSecondPlayer = game.tokens[ i ][ j ];
                                                break loop3;
                                            }
                                        }
                                    }
                                }
                            }
                        }else
                            //мешаем победить противнику
                            if ( contraToken !== undefined ) {
                                const  flag = this.timerPause( 2 );
                                if ( flag ) {
                                    contraToken.isActive = true;
                                    contraToken.isRedrawToken = true;
                                    contraToken.color = this.playerSecond.color;
                                    this.playerSecond.isTurned = true;
                                    contraToken.setNeighborsClickableStatus();
                                    this.#isFirstTurnPC = true;

                                    contraToken.getVictory();
                                    //this.lastTokenOfSecondPlayer = contraToken;
                                }
                            }
                }
            }
        }else{
            this.isDeadHeat = true;
        }

        }
        //находим альтернативные варианты хода
        getAltTokenToTurnPC( mode ) {
            //выбор режима: предотвратить оппоненту победить или победить установко 4 фишки в ряд
            let desiredColor;
            let contraColor;
            //выбор режима
            if ( mode === 'altTurn' ) {
                desiredColor = this.playerSecond.color; //'blue';
                contraColor = this.playerFirst.color; //'red'
            }else
                if ( mode === 'contra' ) {
                        desiredColor = this.playerFirst.color; //'red'
                        contraColor = this.playerSecond.color; //'blue'
                    }
            //находим фишку РС
            let swapTokens = [];

            let r = 60;
            let x, y;

            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                    if ( game.tokens[i][j].color === desiredColor ) { //'blue'
                        swapTokens.push( game.tokens[ i ][ j ] );
                    }
                }
            }

            //console.log( swapTokens );
            
            for ( const swapToken of swapTokens ) {
                //выбор углов для проверки возможного выигрыша
                loop2:
                for ( let angle = 0; angle < 360; angle += 45 ) {
                    let arr = [];

                    if ( angle % 2 === 0 ) {
                        r = 60;
                    }else
                        if ( angle % 2 !== 0 ) {
                            r = 85;
                        }

                    for ( let n = 1; n <= 3; n++ ) {
                        for ( let i = 0; i < 6; i++ ) {
                            for ( let j = 0; j < 7; j++ ) {
                                x = r * n * Math.cos( angle * Math.PI / 180 );
                                y = r * n * Math.sin( angle * Math.PI / 180 );
                                if ( n >= 1 && n <= 2 && ctx.isPointInPath( game.tokens[ i ][ j ].circle, swapToken.center.x + x, swapToken.center.y + y ) && game.tokens[ i ][ j ].color === desiredColor ) {
                                    arr.push( game.tokens[ i ][ j ] );
                                }else
                                    if ( n >= 1 && n <= 2 && ctx.isPointInPath( game.tokens[ i ][ j ].circle, swapToken.center.x + x, swapToken.center.y + y ) && game.tokens[ i ][ j ].color === contraColor ) {
                                        continue loop2;
                                    }else
                                        if ( n === 3 && ctx.isPointInPath( game.tokens[ i ][ j ].circle, swapToken.center.x + x, swapToken.center.y + y ) && game.tokens[ i ][ j ].color === '' ) {
                                            arr.push( game.tokens[ i ][ j ] );
                                        }
                            }
                        }
                    }
                    //проверка условий
                    if (  arr.length <= 2  ) {
                        arr.splice( 0, arr.length );
                        continue loop2;
                    }else
                        if (  arr.length === 3  ) {
                            return arr[ arr.length - 1 ];
                        }
                }
            }
        }
        //получаем предпочтительный угол
        getPrefferedAngleToMovePC() {
            let r = 60;
            let x, y;
            let swapAngles = [];
            let resultPrefferedAngles = [];

            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                    if ( game.tokens[ i ][ j ] !== this.lastTokenOfSecondPlayer &&  game.tokens[ i ][ j ].color !== this.playerFirst.color ) {   //'red'                     
                        for ( let angle = 0; angle < 360; angle += 45 ) {
                            x = r * Math.cos( angle * Math.PI / 180 );
                            y = r * Math.sin( angle * Math.PI / 180 );
                            if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + x, this.lastTokenOfSecondPlayer.center.y + y ) && game.tokens[ i ][ j ].color === this.playerSecond.color ) { //'blue'
                                switch ( angle ) {
                                    case 0:
                                        swapAngles.push(180);
                                        break;
                                    case 45:
                                        swapAngles.push(225);
                                        break;
                                    case 90:
                                        swapAngles.push(270);
                                        break;
                                    case 135:
                                        swapAngles.push(315);
                                        break;
                                    case 180:
                                        swapAngles.push(0);
                                        break;
                                    case 225:
                                        swapAngles.push(45);
                                        break;
                                    case 270:
                                        swapAngles.push(90);
                                        break;
                                    case 315:
                                        swapAngles.push(135);
                                        break;
                                    }
                            }
                        }
                    }
                }
            }
            //если на направлении красный
            for ( let swapAngle of swapAngles) {
                loop1:
                for ( let i = 0; i < 6; i++ ) {
                    for ( let j = 0; j < 7; j++ ) {
                        if ( game.tokens[ i ][ j ] !== this.lastTokenOfSecondPlayer &&  game.tokens[ i ][ j ].color !== this.playerFirst.color ) {    //'red'                    
                                x = r * Math.cos( swapAngle * Math.PI / 180 );
                                y = r * Math.sin( swapAngle * Math.PI / 180 );
                                if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + x, this.lastTokenOfSecondPlayer.center.y + y ) && game.tokens[ i ][ j ].color === this.playerFirst.color ) { //'red'
                                    break loop1;
                                }else{
                                    if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + x, this.lastTokenOfSecondPlayer.center.y + y ) && game.tokens[ i ][ j ].color === '' ) {
                                        resultPrefferedAngles.push( swapAngle );
                                }
                            }
                        }
                    }
                }
            }
                return resultPrefferedAngles;
        }
        //получаем направления где свободных клеток больше 4х
        getAnglesToMovePC() {
            let swapAngles = [];

            let r = 60;
            let x, y;
            //выбор углов для проверки, есть ли достаточного количества пустых ячеек
            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                    if ( game.tokens[ i ][ j ] !== this.lastTokenOfSecondPlayer ) {                       
                        for ( let angle = 0; angle < 360; angle += 45 ) {
                            x = r * Math.cos( angle * Math.PI / 180 );
                            y = r * Math.sin( angle * Math.PI / 180 );
                            if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + x, this.lastTokenOfSecondPlayer.center.y + y ) && game.tokens[ i ][ j ].color === '' ) {
                                swapAngles.push( angle );
                            }
                        }
                    }
                }
            }

                let angle0 = {
                    angle: '0',
                    count: 0
                }
                let angle90 = {
                    angle: '90',
                    count: 0
                }
                let angle180 = {
                    angle: '180',
                    count: 0
                }
                let angle270 = {
                    angle: '270',
                    count: 0
                }
                let angle45 = {
                    angle: '45',
                    count: 0
                }
                let angle225 = {
                    angle: '225',
                    count: 0
                }
                let angle135 = {
                    angle: '135',
                    count: 0
                }
                let angle315 = {
                    angle: '315',
                    count: 0
                }
                const resultingAngles = [ angle0, angle90, angle180, angle270, angle45, angle225, angle135, angle315 ];

                for ( const swapAngle of swapAngles ) {

                    if ( swapAngle !== undefined ) {    //горизонталь

                        if ( swapAngle % 2 === 0 ) {
                            r = 60;

                            for ( let n = 1; n <= 4; n++ ) {
                                for ( let i = 0; i < 6; i++ ) {
                                    for ( let j = 0; j < 7; j++ ) {
                                        let swapX;
                                        let swapY;
                                        swapX = r * n * Math.cos( swapAngle * Math.PI / 180 );
                                        swapY = r * n * Math.sin( swapAngle * Math.PI / 180 );

                                        if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + swapX, this.lastTokenOfSecondPlayer.center.y + swapY ) && game.tokens[ i ][ j ].color === '' ) {
                                            switch ( swapAngle ) {
                                                case 0:
                                                    angle0.count++;
                                                    break;
                                                case 90:
                                                    angle90.count++;
                                                    break;
                                                case 180:
                                                    angle180.count++;
                                                    break;
                                                case 270:
                                                    angle270.count++;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }else
                        if ( swapAngle % 2 !== 0 ) {
                                r = 85;

                                for ( let n = 1; n <= 4; n++ ) {

                                    for ( let i = 0; i < 6; i++ ) {
                                        for ( let j = 0; j < 7; j++ ) {
                                            let swapX;
                                            let swapY;
                                            swapX = r * n * Math.cos( swapAngle * Math.PI / 180 );
                                            swapY = r * n * Math.sin( swapAngle * Math.PI / 180 );

                                            if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.lastTokenOfSecondPlayer.center.x + swapX, this.lastTokenOfSecondPlayer.center.y + swapY ) && game.tokens[ i ][ j ].color === '' ) {
                                                switch ( swapAngle ) {
                                                    case 45:
                                                    angle45.count++;
                                                        break;
                                                    case 135:
                                                    angle135.count++;
                                                        break;
                                                    case 225:
                                                    angle225.count++;
                                                        break;
                                                    case 315:
                                                    angle315.count++;
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                }
                        }
                    }
                }

                let result = [];
                let resultAngle = 0;
                //проверка количества пустых фишек на направлении
                for ( let i = 0; i < resultingAngles.length; i++ ) {
                    if ( resultingAngles[i].count >= 3 ) {
                        result.push( resultingAngles[ i ] );
                    }
                }
                //если нет результата, то
                if( result.length === 0 )  {

                    return resultAngle = undefined;
                }
                if ( result.length >= 2 ) {
                    //случ. образом выбираем куда двигаться
                    const index =  Math.floor( Math.random() * ( result.length - 1 ) );
                    resultAngle = result[ index ].angle;
                }else{
                    resultAngle = result[ 0 ].angle;
                }

                return resultAngle;
        }
        //есть ли пустые ячекии
        isEmptyCells() {
            let arr = [];

            for ( let i = 0; i < 6; i++ ) {
                for ( let j = 0; j < 7; j++ ) {
                        if ( this.tokens[i][j].color === '' ) {
                            arr.push( 'true' );
                        }
                    }
            }
            if ( arr.length !== 0 ) {
                return true;
            }else{
                return false;
            }

        }
        //отрисовка фона
        drawBackGround() {
            ctxBG.beginPath();
                ctxBG.moveTo( this.coords.x, this.coords.y );
                ctxBG.lineTo( this.coords.x + this.size.width, this.coords.y );
                ctxBG.lineTo( this.coords.x + this.size.width, this.coords.y + this.size.height );
                ctxBG.lineTo( this.coords.x, this.coords.y + this.size.height );
                ctxBG.lineTo( this.coords.x, this.coords.y );
                ctxBG.fillStyle = 'pink';
                ctxBG.fill();
                ctxBG.stroke();
            ctxBG.closePath();
            ctxBG.strokeText( 'OVVosokor', 370,435 );
        }
        //render screen
        drawScreen() {
            this.timer();
            this.drawStartMenu();
            this.playButton();
            this.stopButton();
            this.drawUI();
            this.toggleButton();
            this.turnPC();
            this.drawTokens();
        }
    }

    class Token {
        coords = {
            x: 0,
            y: 0
        };
        size = {
            radius: 25
        };
        center = {
            x: 0,
            y: 0
        };
        #isActive = false;
        #color = '';
        #victoryColor = 'gold';
        #inActiveColor = 'white';
        isClickable = false;
        #circle = new Path2D();
        isRedrawToken = false;

        get circle() {
            return this.#circle;
        }
        get color() {
            return this.#color;
        }
        set color( value ) {
            return this.#color = value;
        }
        get isActive() {
            return this.#isActive;
        }
        set isActive( value ) {
            return this.#isActive = value;
        }
        //устанавливает ClickableStatus в ближайших фишках
        setNeighborsClickableStatus() {
            let r = 60;
            let x, y;
            for ( let k = 0; k < 9; k ++ ) {
                x = r * Math.cos( k * Math.PI / 4 );
                y = r * Math.sin( k * Math.PI / 4 );
                for ( let i = 0; i < 6; i++ ) {
                    for ( let j = 0; j < 7; j++ ) {
                        if ( !game.tokens[i][j].isFill && ctx.isPointInPath( game.tokens[i][j].circle, this.center.x + x, this.center.y + y ) ) {
                            game.tokens[i][j].isClickable = true;
                        }
                    }
                }
            }
        }
        //проверяем - победа?
        getVictory() {

            if ( game.isStart ) {
                let r = 60;
                let x, y;

                let swapAngles = [];
                let victoryStatus0 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus45 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus90 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus135 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus180 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus225 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus270 = {
                    count: 0,
                    tokens: []
                };
                let victoryStatus315 = {
                    count: 0,
                    tokens: []
                };
                const VICTORY_STATUS_ARR = [ victoryStatus0, victoryStatus45, victoryStatus90, victoryStatus135, victoryStatus180, victoryStatus225, victoryStatus270, victoryStatus315 ];
                //выбор угла
                for ( let i = 0; i < 6; i++ ) {
                    for ( let j = 0; j < 7; j++ ) {
                        if ( game.tokens[ i ][ j ] !== this ) {                       
                            for ( let angle = 0; angle < 360; angle += 45 ) {
                                x = r * Math.cos( angle * Math.PI / 180 );
                                y = r * Math.sin( angle * Math.PI / 180 );
                                if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.center.x + x, this.center.y + y ) && game.tokens[ i ][ j ].color === this.#color ) {
                                    swapAngles.push( angle );
                                }
                            }
                        }
                    }
                }

                for ( let swapAngle of swapAngles ) {

                    if ( swapAngle !== undefined ) {    //горизонталь

                        if ( swapAngle % 2 === 0 ) {
                            r = 60;
                            loop1:
                            for ( let n = 1; n <= 4; n++ ) {

                                for ( let i = 0; i < 6; i++ ) {
                                    for ( let j = 0; j < 7; j++ ) {
                                        let swapX;
                                        let swapY;
                                        swapX = r * n * Math.cos( swapAngle * Math.PI / 180 );
                                        swapY = r * n * Math.sin( swapAngle * Math.PI / 180 );

                                        if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.center.x + swapX, this.center.y + swapY ) && game.tokens[ i ][ j ].color !== this.#color 
                                            && game.tokens[ i ][ j ].color !== undefined ) {
                                            break loop1;
                                        }else
                                            if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.center.x + swapX, this.center.y + swapY ) && game.tokens[ i ][ j ].color === this.#color ) {

                                                switch ( swapAngle ) {
                                                    case 0:
                                                        victoryStatus0.angle = '0 deg';
                                                        victoryStatus0.count++;
                                                        victoryStatus0.tokens.push(game.tokens[ i ][ j ]);
                                                        break;
                                                    case 90:
                                                        victoryStatus90.angle = '90 deg';
                                                        victoryStatus90.count++;
                                                        victoryStatus90.tokens.push(game.tokens[ i ][ j ]);
                                                        break;
                                                    case 180:
                                                        victoryStatus180.angle = '180 deg';
                                                        victoryStatus180.count++;
                                                        victoryStatus180.tokens.push(game.tokens[ i ][ j ]);
                                                        break;
                                                    case 270:
                                                        victoryStatus270.angle = '270 deg';
                                                        victoryStatus270.count++;
                                                        victoryStatus270.tokens.push(game.tokens[ i ][ j ]);
                                                        break;
                                                }
                                            }
                                    }
                                }
                            }
                            
                        }else                           //диагональ                   
                        if ( swapAngle % 2 !== 0 ) {
                            {   
                                r = 85;
                                loop2:
                                for ( let n = 1; n <= 4; n++ ) {

                                    for ( let i = 0; i < 6; i++ ) {
                                        for ( let j = 0; j < 7; j++ ) {
                                            let swapX;
                                            let swapY;
                                            swapX = r * n * Math.cos( swapAngle * Math.PI / 180 );
                                            swapY = r * n * Math.sin( swapAngle * Math.PI / 180 );

                                            if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.center.x + swapX, this.center.y + swapY ) && game.tokens[ i ][ j ].color !== this.#color 
                                                && game.tokens[ i ][ j ].color !== undefined ) {
                                                break loop2;
                                            }else
                                                if ( ctx.isPointInPath( game.tokens[ i ][ j ].circle, this.center.x + swapX, this.center.y + swapY ) && game.tokens[ i ][ j ].color === this.#color ) {

                                                    switch (swapAngle) {
                                                        case 45:
                                                            victoryStatus45.angle = '45 deg';
                                                            victoryStatus45.count++;
                                                            victoryStatus45.tokens.push(game.tokens[ i ][ j ]);
                                                            break;
                                                        case 135:
                                                            victoryStatus135.angle = '135 deg';
                                                            victoryStatus135.count++;
                                                            victoryStatus135.tokens.push(game.tokens[ i ][ j ]);
                                                            break;
                                                        case 225:
                                                            victoryStatus225.angle = '225 deg';
                                                            victoryStatus225.count++;
                                                            victoryStatus225.tokens.push(game.tokens[ i ][ j ]);
                                                            break;
                                                        case 315:
                                                            victoryStatus315.angle = '315 deg';
                                                            victoryStatus315.count++;
                                                            victoryStatus315.tokens.push(game.tokens[ i ][ j ]);
                                                            break;
                                                    }
                                                }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            // console.log( 'angle0 ', victoryStatus0.count, 'angle90', victoryStatus90.count, 'angle180', victoryStatus180.count, 'angle270', victoryStatus270.count )
             //   console.log( 'angle45 ', victoryStatus45.count, 'angle135', victoryStatus135.count, 'angle225', victoryStatus225.count, 'angle315', victoryStatus315.count )
                
                // проверяем результаты 
                for ( let victoryStatus of VICTORY_STATUS_ARR ) {
                    //проверка победы при установке фишки скраю в ряд
                    if ( victoryStatus.count >= 3 ) {
                        victoryStatus.tokens.push( this );
                        for ( let i = 0; i < 4; i++ ) {
                            victoryStatus.tokens[ i ].color = this.#victoryColor;
                            victoryStatus.tokens[ i ].isRedrawToken = true;
                        }
                        game.isVictory = true;
                    }else
                        //проверка победы при установке фишки между своими фишками
                        if ( victoryStatus.count < 3 ) {
                            const angleObj = {
                                '0 deg': '180 deg',
                                '90 deg': '270 deg',
                                '45 deg': '225 deg',
                                '135 deg': '315 deg'
                            }
                            const angles = [ '0 deg', '90 deg', '45 deg', '135 deg' ];
                            for ( let angle of angles ) {

                                    if ( victoryStatus.angle === angle ) {
                                        const swapCount = victoryStatus.count;
                                        const swapTokens = victoryStatus.tokens;
        
                                        for ( let victoryStatus of VICTORY_STATUS_ARR ) {
                                            if ( victoryStatus.angle === angleObj[ angle ] && ( victoryStatus.count + swapCount ) >= 3 ) {
                                                victoryStatus.tokens.push( this );
                                                victoryStatus.tokens = victoryStatus.tokens.concat( swapTokens );
                                                for ( let i = 0; i < 4; i++ ) {
                                                    victoryStatus.tokens[ i ].color = this.#victoryColor;
                                                    victoryStatus.tokens[ i ].isRedrawToken = true;
                                                }
                                                game.isVictory = true;
                                            }
                                        }
                                    }
                            }
                        }
                }
            }
        }
        //отрисовка фишки при инициализации
        initDrawToken() {
            if ( !this.#isActive  ) { //если не активен
                ctx.fillStyle = this.#inActiveColor;
                this.#circle.arc( game.coords.x + this.coords.x + 35 , game.coords.y + this.coords.y + 100 , this.size.radius , 0,  Math.PI * 2 );
                ctx.fill( this.#circle );
            }
        }
        //рисуем фишки
        drawToken() {
            // если не заполнен и клик по нему
            if ( game.isEmpty && game.playerFirst.isTurned === false && game.playerSecond.isTurned === false && this.isClickable ) {
                if ( game.isEmptyCells() ) {
                    if ( this.#color === '' && ctx.isPointInPath( this.#circle, mouseClickCoords.x, mouseClickCoords.y ) ) {
                        if ( game.playerFirst.isActive ) {
                            this.#isActive = true;
                            mouseClickCoords.x = undefined;
                            mouseClickCoords.y = undefined;
                            game.playerFirst.isTurned = true;
                            game.isRedrawToggleButton = true;
                            game.lastTokenOfFirstPlayer = this;
                            this.setNeighborsClickableStatus();
                        }else 
                            if ( game.playerSecond.isActive ) {
                                this.#isActive = true;
                                mouseClickCoords.x = undefined;
                                mouseClickCoords.y = undefined;
                                game.playerSecond.isTurned = true;
                                game.isRedrawToggleButton = true;
                                this.setNeighborsClickableStatus();
                            }
                    }
                }else
                    if ( !game.isEmptyCells() ) {
                        game.isEmpty = false;
                        game.isDeadHeat = true;
                    }
            }
            //если токен активен, то он меняет цвет соответственно цвету игрока
            if ( this.#isActive ) { //если активен
                if ( game.playerFirst.isActive ) {
                    if ( this.#color === '' ) {
                        this.#color = game.playerFirst.color;
                        this.getVictory();
                        //ctx.fillStyle = this.#color;
                        this.isRedrawToken = true;
                    }
                }else 
                    if ( game.playerSecond.isActive ) {
                        if ( this.#color === '' ) {
                            this.#color = game.playerSecond.color;
                            this.getVictory();
                            //ctx.fillStyle = this.#color;
                            this.isRedrawToken = true;
                        }
                    }
            }

            if ( this.isRedrawToken ) {
                ctx.clearRect( game.coords.x + this.coords.x + 8 , game.coords.y + this.coords.y + 73, 55, 55 );

                ctx.fillStyle = this.#color;
                this.#circle.arc( game.coords.x + this.coords.x + 35 , game.coords.y + this.coords.y + 100 , this.size.radius , 0,  Math.PI * 2 );
                ctx.fill( this.#circle );
                this.isRedrawToken = false;
            }
        }
    }

    //цикл игры
    function gameLoop() {
        game.drawScreen();
        window.requestAnimationFrame( gameLoop );
    }

    //обработчики событий
    function mouseMoveHandler( e ) {
        mouseMoveCoords.x = e.offsetX;
        mouseMoveCoords.y = e.offsetY;
    }

    function mouseUpHandler( e ) {
            mouseClickCoords.x = e.offsetX;
            mouseClickCoords.y = e.offsetY;
            if ( game.playerSecond.isActive && !game.playerSecond.isTurned && game.isChooseModePvE ) {
                mouseClickCoords.x = undefined;
                mouseClickCoords.y = undefined;
            }
    }
    //слушатели событий
    canvas.addEventListener( 'mousemove', mouseMoveHandler );
    canvas.addEventListener( 'mouseup', mouseUpHandler );

    const game = new Game();

    game.init();
    gameLoop();

    }