/*
  Pathfinding.js - for pathfinding elements in the game.
*/



function Waypoint(args){
    this.x = args.x;
    this.y = args.y;
    this.adjacentPaths = [];
}



function Path(args){
    this.wpStart = args.wpStart;
    this.wpEnd = args.wpEnd;
    this.curve = args.curve;
    
    // Regsiter ourselfs with the waypoints.
    args.wpStart.adjacentPaths.push(this);
    //args.wpEnd.adjacentPaths.push(this);
    
    // Approximate the length of the Path from the curve.
    this.length = Geometry.estimateLength(args.curve, 100);
}



function updateAICarrot(carrot){
    /*
      Move the carrot (the thing the AI chases) further along the path;
      
      If the carrot moves beyond the edge of this Path, we select another
       Path for the carrot to follow.
    */
    
    if(carrot.t === undefined ||
       carrot.path === undefined ||
       carrot.speed === undefined ||
       carrot.pt === undefined){
        throw "Carrot does not have all the variables this method expects it to have! [Path.updateACarrot]";
    }
    
    var t = carrot.t;
    var dt = carrot.speed / carrot.path.length; // Normalise distance moved on the path
    
    if(dt > 1){
        throw "This is far too fast for what I expect.";
    }
    
    if(carrot.t + dt > 1){
        // t+dt is greater than one; we need to select another path.
        // Select the next path randomly.
        var nextPaths = carrot.path.wpEnd.adjacentPaths;
        var rnd = Math.floor(Math.random() * nextPaths.length);
        var nextPath = nextPaths[rnd];
        
        carrot.t = t - 1; // Assume that the speed is always small enough for the path
        carrot.path = nextPath;
        
        // Recursively apply the logic here.
        updateAICarrot(carrot);
    } else {
        carrot.t = t + dt;
    }
    
    carrot.pt = Geometry.evaluateCurve(carrot.path.curve, carrot.t);
}