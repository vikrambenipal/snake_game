    /*
    // Draws the Grid 
    ctx.beginPath();
    var x = 32;
    var y = 95;
    var box = 32;
    for(var i = 0; i < 15; ++i){
        for(var j = 0; j < 17; ++j){
            
            ctx.rect(x,y,box,box);
            ctx.fillStyle = "#32627A";
            ctx.stroke();
            ctx.strokeStyle = "#929292";
            ctx.lineWidth = "0.5";
            x += 32;
        }
        x = 32;
        y += 32;
    }


    // Draws the Border of the Grid 
    /*
    x = 0;
    y = 63;

    for(var i = 0; i < 17; ++i){
        for(var j = 0; j < 19; ++j){
            if(i == 0 || i == 16){
                //ctx.beginPath();
                ctx.rect(x,y,box,box);
                ctx.fill();
                ctx.fillStyle = "red";
            }else if(j == 0 || j == 18){
                ctx.beginPath();
                ctx.rect(x,y,box,box);
                ctx.fill();
                ctx.fillStyle = "red";
            }
            x += 32;
        }
        x = 0;
        y += 32;
    }*/