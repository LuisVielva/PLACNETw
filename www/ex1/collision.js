// http://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection (el de clamp)
// http://www.java-gaming.org/topics/vectors-what-s-the-point/24307/view.html

function __collisionCircleRect()
{
	var xmin = Number(_rectSelection.getAttribute("x"));
	var ymin = Number(_rectSelection.getAttribute("y"));
	var xmax = xmin + Number(_rectSelection.getAttribute("width"));
	var ymax = ymin + Number(_rectSelection.getAttribute("height"));	
		
	var nodo = svg.selectAll(".node, .nodePreSelected")[0];
	// var oop = nodo[0].offsetParent.getBoundingClientRect();
	var oop = document.getElementById("idCenterRegion-body").getBoundingClientRect();
		
	for (var k = 0; k < nodo.length; k++)
	{
		var clientRect = nodo[k].getBoundingClientRect();
		
		var left = clientRect.left - oop.left;
		var right = clientRect.right - oop.left;
		var top = clientRect.top - oop.top;
		var bottom = clientRect.bottom - oop.top;
		
		var x = (left + right) / 2;
		var y = (top + bottom) / 2;
		var r = (right - left) / 2;
				
		// Puedo seleccionar si el circulo esta completamente dentro o si hay colision 
		nodo[k].setAttribute
		(
			"class", 
//			__boundingBoxInRectangle(left, top, right, bottom, xmin, ymin, xmax, ymax) ?
			__circleIntersectsRectangle(x, y, r, xmin, ymin, xmax, ymax)  ?
			"nodePreSelected" : "node"
		);		
	}
}

// BoundingBox: left, top, right, bottom
// Rectangle: xmin, xmax, ymin, ymax
function __boundingBoxInRectangle(left, top, right, bottom, xmin, ymin, xmax, ymax)
{
	return left > xmin && right < xmax && top > ymin && bottom < ymax;
}

// limits value to the interval [min, max]
function __clamp(value, min, max) 
{
	return Math.min(max, Math.max(min, value));
}

function __circleIntersectsRectangle(x, y, r, xmin, ymin, xmax, ymax) 
{
	// Find the closest point to the circle within the rectangle
	var closestX = __clamp(x, xmin, xmax);
	var closestY = __clamp(y, ymin, ymax);	
	
	// Calculate the distance between the circle's center and this closest point
	var distanceX = x - closestX;
	var distanceY = y - closestY;
	
	// If the distance is less than the circle's radius, an intersection occurs
	var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

	return distanceSquared < (r*r);
}

function __collisionLineRect()
{
	var xmin = Number(_rectSelection.getAttribute("x"));
	var ymin = Number(_rectSelection.getAttribute("y"));
	var xmax = xmin + Number(_rectSelection.getAttribute("width"));
	var ymax = ymin + Number(_rectSelection.getAttribute("height"));
	
	var link = svg.selectAll(".link, .linkPreSelected")[0];
	// var oop = link[0].offsetParent.getBoundingClientRect();
	var oop = document.getElementById("idCenterRegion-body").getBoundingClientRect();
	
	for (var k = 0; k < link.length; k++)
	{
		var clientRect = link[k].getBoundingClientRect();
		// Con este clientRect hay dos segmentos posibles (las dos diagonales)
		var signo = (link[k].x1.animVal.value - link[k].x2.animVal.value)
		          * (link[k].y1.animVal.value - link[k].y2.animVal.value);
		var x0 = clientRect.left - oop.left;
		var x1 = clientRect.right - oop.left;
		var y0 = ((signo <= 0) ? clientRect.bottom : clientRect.top) - oop.top;
		var y1 = ((signo <= 0) ? clientRect.top : clientRect.bottom) - oop.top;
		
		link[k].setAttribute
		(
			"class",
			__lineIntersectsRectangle(x0, y0, x1, y1, xmin, ymin, xmax, ymax) ?
			"linkPreSelected" : "link"
		);
	}
}

// Check if the line from (x0,y0) to (x1,y1) intersects the rectangle
// with diagonal from (xmin,ymin) to (xmax,ymax)
function __lineIntersectsRectangle(x0, y0, x1, y1, xmin, ymin, xmax, ymax)  
{  
	var di, st, et, fst = 0, fet = 1;    

	di = x1 - x0;  
	if (x0 < x1) 
	{  
	   if (x0 > xmax || x1 < xmin) return false;  
	   st = (x0 < xmin) ? (xmin - x0) / di : 0;  
	   et = (x1 > xmax) ? (xmax - x0) / di : 1;  
	}  
	else 
	{  
	   if (x1 > xmax || x0 < xmin) return false;  
	   st = (x0 > xmax)? (xmax - x0) / di : 0;  
	   et = (x1 < xmin)? (xmin - x0) / di : 1;   
	}  
	
	if (st > fst) fst = st;  
	if (et < fet) fet = et;  
	if (fet < fst) return false;  	
   
	di = y1 - y0;  
	if (y0 < y1) 
	{  
	   if (y0 > ymax || y1 < ymin) return false;  
	   st = (y0 < ymin) ? (ymin - y0) / di : 0;  
	   et = (y1 > ymax) ? (ymax - y0) / di : 1;  
	}  
	else 
	{  
	   if (y1 > ymax || y0 < ymin) return false;  
	   st = (y0 > ymax)? (ymax - y0) / di: 0;  
	   et = (y1 < ymin)? (ymin - y0) / di: 1;  
	}  
	
	if (st > fst) fst = st;  
	if (et < fet) fet = et;  
	if (fet < fst) return false; 	   

   return true;  
}  