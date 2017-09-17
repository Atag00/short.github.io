$(document).ready(function() {


	function Popup(options){
	    this.form = document.querySelector('#Dlform');
	    this.overlay = document.querySelector('#DlModal');
	    
	    var popup = this;
	    
	    this.open = function(){
	        popup.overlay.classList.add('open');
	        popup.form.classList.add('open');
	    }
	    
	    this.close = function(){
	        popup.overlay.classList.remove('open');
	        popup.form.classList.remove('open');
	    }
	    

	    document.querySelector('#DlModal .close').onclick = popup.close;
	};
	
	 var p = new Popup();
    
    	document.querySelector('.start button').onclick = function(){
        p.open();
        console.log(p);
    };

			/* Функція перевірки цілих чисел */
		
    function isInteger(num) {  
  		return num == (num ^ 0);   
	};

	var formControl = (document.querySelectorAll('#Dlform .form-control'));
	for (var i = 0; i < formControl.length; i++) {

		formControl[i].onblur = function(){
			var error = false;
			console.log(this.value);
			if(this.value < 0 || this.value > 10 || this.value === '' || isNaN(this.value)){
	 			this.classList.add('err');
	 			error = true;
	 		} else {
	 			this.classList.remove('err');
	 		};
	 	};		
	};
	
	
	document.querySelector('#Dlform input[type=submit]').onclick = function(e){
		for (var i = 0; i < formControl.length; i++) {
			if (formControl[i].classList.contains('err')){
				return false;
			};
		};
		var dep = [];
		var dest = [];
		dep[0] = +document.querySelector('#Dlform .depX').value,
		dep[1] = +document.querySelector('#Dlform .depY').value,
		dest[0] = +document.querySelector('#Dlform .destX').value,
		dest[1] = +document.querySelector('#Dlform .destY').value;
		var street1 = (isInteger(dep[0]) || isInteger(dep[1]));
		var street2 = (isInteger(dest[0]) || isInteger(dest[1]));
		console.log(street1, street2);
		console.log('dep[0] > dest[0] - ' + (dep[0] > dest[0]));

		if (!street1 || !street2){
			return false;
		};
		p.close();
		run(dep, dest); 
	};

	function run(dep, dest){


		var wrapper = document.getElementById('wrapper'),
		canvas = document.getElementById('grid'),
		context = canvas.getContext('2d'),
		step = 48,
		startY, endY, startX, endX,
		shortesPathObj,
		shortesPath; 
		 console.log("dep[0]  - " + dep[0], 'dest[0] - ' + dest[0]);
		    console.log('dep[0] > dest[0] - ' + (dep[0] > dest[0]));   		

				/* Розмітка вулиць */			

		canvas.height = 480;
		canvas.width = 695;	
		context.strokeStyle = 'cyan';
		context.strokeRect(100, 0, 480, 480);

		
		for (var i = 0; i < 480; i += step) {
	    	context.moveTo(i + 100, 0);
	    	context.lineTo(i + 100, 480);
	    	context.stroke();
		}

		for (var i = 0; i < 480; i += step) {
		    context.moveTo(100, i);
		    context.lineTo(580, i);
		    context.stroke();
		}

				/* Зображення точок маршруту */

		context.fillStyle = 'rgba(46, 204, 113,0.4)';
		context.beginPath();
	    context.arc(dep[0] * 48 + 100, dep[1] * -48 + 480, 10, 0, Math.PI*2, true);
	    context.moveTo(dest[0] * 48 + 110, dest[1] * -48 + 480);
	    context.arc(dest[0] * 48 + 100, dest[1] * -48 + 480, 10, 0, Math.PI*2, true);
	    context.fill();
	    context.closePath()

	    function Path(){
	    	this.start = dep;
	    	this.end = dest;
	    	this.firstPoint = [];
	    	this.secondPoint = [];
	    };

	    
	    		/* Функція визначення довжини маршруту */

		function length (way) {
	     	var x = Math.abs(way.start[0] - way.firstPoint[0]) + Math.abs(way.firstPoint[0] - way.secondPoint[0]) + Math.abs(way.secondPoint[0] - way.end[0]) +
	     	Math.abs(way.start[1] - way.firstPoint[1]) + Math.abs(way.firstPoint[1] - way.secondPoint[1]) + Math.abs(way.secondPoint[1] - way.end[1]);
	     	return x;
	    };


	    var firstPath = new Path(); /*Обєкт першого маршруту*/
	    var secondPath = new Path();  /*Обєкт другого маршруту*/
	    	
	    		/*Визначення координат першої транзитної точки*/

	    if(isInteger(dep[0])){
	    	firstPath.firstPoint[1] = Math.floor(dep[1]);
	    	secondPath.firstPoint[1] = Math.ceil(dep[1]); 
	    	firstPath.firstPoint[0] = secondPath.firstPoint[0] = dep[0];

	    } else {    	
	    	firstPath.firstPoint[0] = Math.floor(dep[0]);
	       	secondPath.firstPoint[0] = Math.ceil(dep[0]);   
	       	firstPath.firstPoint[1] = secondPath.firstPoint[1] = dep[1];
	    }
	    console.log(secondPath.firstPoint, firstPath.firstPoint);

	    		/*Визначення координат другої транзитної точки*/

	    if(isInteger(dest[0])){
	    	firstPath.secondPoint[0] = secondPath.secondPoint[0] = dest[0];
	     	firstPath.secondPoint[1] = firstPath.firstPoint[1];
	     	secondPath.secondPoint[1] = secondPath.firstPoint[1];
	     
	    } else {
	     	firstPath.secondPoint[1] = secondPath.secondPoint[1] = dest[1];
	     	firstPath.secondPoint[0] = firstPath.firstPoint[0];
	     	secondPath.secondPoint[0] = secondPath.firstPoint[0];
	    };

	    		/* Визначення обєкту найкоротшого маршруту */

	    shortesPathObj = (length(firstPath) > length(secondPath)) ? secondPath : firstPath;
			
	 			/*Зображення маршруту*/

	 	if(dep[0] === dest[0] || (dep[1] === dest[1])){
		    context.beginPath();
		 	context.lineWidth = 4;
		 	context.strokeStyle = 'red';
		 	context.moveTo(dep[0] * 48 + 100, dep[1] * -48 + 480);
		    context.lineTo(dest[0] * 48 + 100, dest[1] * -48 + 480);
		    context.stroke();
	    } else {
		 	context.beginPath();
		 	context.lineWidth = 4;
		 	context.strokeStyle = 'red';
		 	context.moveTo(dep[0] * 48 + 100, dep[1] * -48 + 480);
		    context.lineTo(shortesPathObj.firstPoint[0] * 48 + 100, shortesPathObj.firstPoint[1] * -48 + 480);
		    context.lineTo(shortesPathObj.secondPoint[0] * 48 + 100, shortesPathObj.secondPoint[1] * -48 + 480);
		    context.lineTo(dest[0] * 48 + 100, dest[1] * -48 + 480);
		    context.stroke();
		};    

	    		/* Підписи координат початку і кінця маршруту */

	    context.fillStyle = "#fff";
	    context.font = 'italic 25px sans-serif';
	    console.log(dep,dest);
	    startY = (dep[1] > 9.2) ? 9.2 : dep[1];
	    endY = (dest[1] > 9.2) ? 9.2 : dest[1];
	     console.log(dep,dest);
	    if (dep[0] > dest[0]){
	    	context.textAlign = "left";
	    	context.fillText("(" + dep[0] + ", " + dep[1] + ")", dep[0] * 48 + 115, startY * -48 + 470);
	    } else {
	    	context.textAlign = "right";
	    	context.fillText("(" + dep[0] + ", " + dep[1] + ")", dep[0] * 48 + 85, startY * -48 + 470);
	    };
	    if (dep[0] <= dest[0]){
	    	context.textAlign = "left";
	    	context.fillText("(" + dest[0] + ", " + dest[1] + ")", dest[0] * 48 + 115, endY * -48 + 470);
	    } else {
	    	context.textAlign = "right";
	    	context.fillText("(" + dest[0] + ", " + dest[1] + ")", dest[0] * 48 + 85, endY * -48 + 470);

	    };	

	    		/* Визначення найкоротшого маршруту */ 

	    if(dep[0] === dest[0]){
	    	shortesPath = Math.abs(dep[1] - dest[1]).toFixed(1);
	    	console.log('(dep[1] - dest[1]) - ' + (dep[1] - dest[1]));
	    } else if(dep[1] === dest[1]){
	    	shortesPath = Math.abs(dep[0] - dest[0]).toFixed(1);	
		} else{
			shortesPath = length(shortesPathObj).toFixed(1);
		};   

	    document.querySelector("header h5").innerHTML = ('The shortest path is <span>' + shortesPath + '</span>');
	    document.querySelector(".start button").innerHTML = ('Try again');
   
	};
});