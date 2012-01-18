/**********************************************************
************** graph.js by Michał Miszczyszyn *************
******************* All rights reserved *******************
**************** michal+graph.js@mmiszy.pl ****************
************ Let me know if you have any fixes! ***********
***********************************************************/
var graph = function (opts)
{
    graph.options = opts;
    defaultOptions = {
            canvas: document.getElementById("drawing"),
            zoom: {x:50, y:50},
            origin: {x:400, y:300},
            equations: {
                    funp: "-Math.sin(x)",
                    funpX0: 0,
                    funpY0: 0,
                    funpStep: 100,
                    euler: 0,
                    euler2: 0,
                    euler3: 1,
                    fun: "Math.cos(x)",
                    funStep: 1
                }
        };
    if(!graph.options)
        graph.options = defaultOptions;
    else
    {
        if(!graph.options.canvas)
            graph.options.canvas = defaultOptions.canvas;
    }
    //console.log(graph.options);
    graph.draw = graph.options.canvas.getContext("2d");
    graph.draw.clearRect(0,0, graph.options.canvas.width, graph.options.canvas.height);
    
    graph.initialize();
}
graph.initialize = function()
{
    if(graph.options.canvas.getContext)
    {
        if(graph.options.equations.funp!='')
        {
            if(graph.options.equations.euler)
                graph.Euler(function(x, y){return eval(graph.options.equations.funp); }, eval(graph.options.equations.funpX0), eval(graph.options.equations.funpY0));
            if(graph.options.equations.euler2)
                graph.Euler2(function(x, y){return eval(graph.options.equations.funp); }, eval(graph.options.equations.funpX0), eval(graph.options.equations.funpY0));
            if(graph.options.equations.euler3)
                graph.Euler3(function(x, y){return eval(graph.options.equations.funp); }, eval(graph.options.equations.funpX0), eval(graph.options.equations.funpY0));
        }
        if(graph.options.equations.fun!='')
            graph.drawFunction(function(x) { return eval(graph.options.equations.fun); });
        graph.drawAxes();
    }
}
graph.drawFunction = function(f)
{
    graph.draw.beginPath();
    var bMoveTo=false;
    for(var posX=-graph.options.origin.x; posX<graph.options.canvas.width-graph.options.origin.x; posX+=(parseFloat(graph.options.equations.funStep)*0.1))
    {
        var x = posX/graph.options.zoom.x;
        var y = f(x)*graph.options.zoom.y;
        if( (!isFinite(y) || Math.round(parseFloat(graph.options.equations.funStep)*y/99999)!=0 ) )
        {
            var bX = f(x-(parseFloat(graph.options.equations.funStep)*0.1));
            var aX = f(x+(parseFloat(graph.options.equations.funStep)*0.1));
            graph.draw.lineTo(graph.options.origin.x+posX, -bX*99999);
            if(bX*aX<0) //sign change!
                graph.draw.moveTo(graph.options.origin.x+posX, bX*99999);
            continue;
        }
        else if(isNaN(y))
        {
            bMoveTo=true;
            //console.log(x,y,bMoveTo);
            continue;
        }
        //else if(graph.options.canvas.height-y-graph.options.origin.y<0 || graph.options.canvas.height-y-graph.options.origin.y> graph.options.canvas.height) continue;
        else if(bMoveTo)
        {
            graph.draw.moveTo(graph.options.origin.x+posX, graph.options.canvas.height-y-graph.options.origin.y);
            bMoveTo=false;
        }
        else
        {
            graph.draw.lineTo(graph.options.origin.x+posX, graph.options.canvas.height-y-graph.options.origin.y);
        }
        //console.log(x,y);
    }
    graph.draw.strokeStyle="orange";
    graph.draw.stroke();
    graph.draw.closePath();
}
graph.Euler = function(fp, x0, y0)  // fp = first derivative
{
    //console.log(x0, y0);
    var h = graph.options.equations.funpStep*0.1/graph.options.zoom.y;
    var curX=x0;
    var curY=y0;
    graph.draw.moveTo(x0, y0);
    graph.draw.beginPath();
    while(curX<graph.options.canvas.width-graph.options.origin.x)
    {
        //console.log(curX, curY);
        graph.draw.lineTo(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        curY+=h*fp(curX, curY);
        curX+=h;
    }
    graph.draw.strokeStyle="red";
    graph.draw.stroke();
    graph.draw.closePath();
    
    var curX=x0;
    var curY=y0;
    graph.draw.moveTo(x0, y0);
    graph.draw.beginPath();
    while(curX+graph.options.origin.x>=-1)
    {
        graph.draw.lineTo(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        console.log(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        curY-=h*fp(curX, curY);
        curX-=h;
    }
    graph.draw.strokeStyle="red";
    graph.draw.stroke();
    graph.draw.closePath();
}
graph.Euler2 = function(fp, x0, y0)  // fp = first derivative
{
    var h = graph.options.equations.funpStep*0.1/graph.options.zoom.y;
    var curX=x0;
    var curY=y0;
    graph.draw.moveTo(x0, y0);
    graph.draw.beginPath();
    while(curX<graph.options.canvas.width-graph.options.origin.x)
    {
        //console.log(curX, curY);
        graph.draw.lineTo(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        curY+=h*(fp(curX, curY)+fp(curX+h, curY+fp(curX, curY)*h))/2;
        curX+=h;
    }
    graph.draw.strokeStyle="blue";
    graph.draw.stroke();
    graph.draw.closePath();
    
    var curX=x0;
    var curY=y0;
    graph.draw.moveTo(x0, y0);
    graph.draw.beginPath();
    while(curX+graph.options.origin.x>=-1)
    {
        graph.draw.lineTo(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        curY-=h*(fp(curX, curY)+fp(curX+h, curY+fp(curX, curY)*h))/2;
        curX-=h;
    }
    graph.draw.strokeStyle="blue";
    graph.draw.stroke();
    graph.draw.closePath();
}
graph.Euler3 = function(fp, x0, y0)  // fp = first derivative
{
    var h = graph.options.equations.funpStep*0.1/graph.options.zoom.y;
    var curX=x0;
    var curY=y0;
    graph.draw.moveTo(x0, y0);
    graph.draw.beginPath();
    while(curX<graph.options.canvas.width-graph.options.origin.x)
    {
        graph.draw.lineTo(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        curY+=fp(curX+h/2, curY+fp(curX, curY)*h/2)*h;
        curX+=h;
    }
    graph.draw.strokeStyle="green";
    graph.draw.stroke();
    graph.draw.closePath();
    
    var curX=x0;
    var curY=y0;
    graph.draw.moveTo(x0, y0);
    graph.draw.beginPath();
    while(curX+graph.options.origin.x>=-1)
    {
        graph.draw.lineTo(curX*graph.options.zoom.x+graph.options.origin.x, graph.options.canvas.height-graph.options.origin.y-curY*graph.options.zoom.y);
        var bY=curY;
        curY-=h*(fp(curX, curY)+fp(curX+h, curY+fp(curX, curY)*h))/2;
        curX-=h;
    }
    
    graph.draw.strokeStyle="green";
    graph.draw.stroke();
    graph.draw.closePath();
}
graph.drawAxes = function()
{
    graph.draw.beginPath();
    graph.draw.moveTo(0, graph.options.canvas.height-graph.options.origin.y);
    graph.draw.lineTo(graph.options.canvas.width, graph.options.canvas.height-graph.options.origin.y);
    graph.draw.moveTo(graph.options.origin.x, 0);
    graph.draw.lineTo(graph.options.origin.x, graph.options.canvas.height);
    graph.draw.strokeStyle="black";
    graph.draw.stroke();
    graph.draw.closePath();
}


var prepare = function()
{
    document.getElementById("proceed").addEventListener("click", onProceedButtonClick, false);
}

var onProceedButtonClick = function()
{
    var $ = function(sel) { return document.getElementById(sel); };
    
    var opts = {
            zoom: { x: parseFloat($("zoomX").value), y: parseFloat($("zoomY").value) },
            origin: { x: parseFloat($("originX").value), y: parseFloat($("originY").value) },
            equations : {
                fun: $("fun").value, funStep: parseFloat($("funStep").value),
                funp: $("funp").value, funpStep: parseFloat($("funpStep").value),
                funpX0: $("funpX0").value, funpY0: $("funpY0").value,
                euler: $("euler").checked, euler2: $("euler2").checked, euler3: $("euler3").checked
                }
        };
    graph(opts);
}

window.addEventListener("load", function() { prepare(); }, false)