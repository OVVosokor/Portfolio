const canvas = document.getElementById( 'myCanvas' );
const ctx = canvas.getContext( '2d' );

function clockNew() {
    const date = new Date();
    const letter = [  'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'I', 'II' ];
    //принцип: сохраняем состояние холста ctx.save();, производим изменения, восстанавливаем состояние холста  ctx.restore()
    ctx.save();
        ctx.clearRect( 0,0, canvas.width, canvas.height );

        ctx.translate( 450, 170 ); //координаты
        ctx.scale( 1.0 , 1.0 ); //масштаб
        ctx.rotate( -Math.PI / 2  );
        ctx.lineCap = 'round';
        //marks
        ctx.save();
            for ( let i = 0; i < 12; i++ ) {
                ctx.beginPath();
                ctx.rotate(Math.PI/6);
                ctx.moveTo(100,0);
                ctx.lineTo(120,0);
                ctx.stroke();
            }
        ctx.restore();
        //hours marks
        ctx.save();
            ctx.lineWidth = 5;
            for ( let i = 0; i < 60; i++ ) {
                if ( i % 5 != 0 ) {
                ctx.beginPath();
                ctx.moveTo(116,0);
                ctx.lineTo(120,0);
                ctx.stroke();
                }
                ctx.rotate( Math.PI / 30 );
            }
        ctx.restore();
        //seconds
        ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'red'
            ctx.beginPath();
                ctx.rotate( ( ( date.getSeconds() ) * 6 ) * Math.PI / 180 );
                ctx.moveTo( -10,0 );
                ctx.lineTo( 120,0 );
                ctx.stroke();
        ctx.restore();
        //minutes
        ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black'
            ctx.beginPath();
                ctx.rotate( ( ( date.getMinutes() ) * 6 ) * Math.PI / 180 );
                ctx.moveTo( -10,0 );
                ctx.lineTo( 110,0 );
                ctx.stroke();
        ctx.restore();
        //hours
        ctx.save();
            ctx.lineWidth = 8;
            ctx.strokeStyle = 'black'
            ctx.beginPath();
                ctx.rotate( ( ( date.getHours() ) * 6 ) * Math.PI / 180 );
                ctx.moveTo( -10,0 );
                ctx.lineTo( 90,0 );
                ctx.stroke();
        ctx.restore();
        //clock frame
        ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'blue'
            ctx.arc( 0, 0, 150, 0, 2 * Math.PI );
            ctx.stroke()
        ctx.restore();

        ctx.save();
            ctx.rotate( Math.PI / 2  );

            for ( i = 0; i < 12; i++ ){
                    let rad = i * Math.PI / 6;  //переводим углы в радианы
                    let x = 135 * Math.cos( rad ); // в полярные координаты
                    let y = 135 * Math.sin( rad ); // в полярные координаты
        
                    ctx.font = "10px serif";
                    ctx.strokeStyle = 'black';
                    ctx.strokeText( letter[ i ], x - 5, y + 2 );
            }
        ctx.restore();

    ctx.restore();


    window.requestAnimationFrame( clockNew );
}
    window.requestAnimationFrame( clockNew );

