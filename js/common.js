$(document).ready(function() {

		/* Функція перевірки цілих чисел */
		
    function isInteger(num) {  
  		return num == (num ^ 0);   
	};

	 $('#Dlform .form-control').on('blur', function(){
	 	var error = false
	 	if($(this).val() < 0 || $(this).val() > 10 || $(this).val() === '' || isNaN($(this).val())){
	 		$(this).addClass('err');
	 		error = true;
	 	} else {
	 		$(this).removeClass('err');
	 	};
	 	       
    });
	
	$('#Dlform input[type=submit]').on('click', function(e){
		if($('.form-control').hasClass('err')){
			return false;
		};
		var dep = [];
		var dest = [];
		dep[0] = $('#Dlform .depX').val(),
		dep[1] = $('#Dlform .depY').val(),
		dest[0] = $('#Dlform .destX').val(),
		dest[1] = $('#Dlform .destY').val();
		var street1 = (isInteger(dep[0]) || isInteger(dep[1]));
		var street2 = (isInteger(dest[0]) || isInteger(dest[1]));
		console.log(street1, street2);

		if (!street1 || !street2){
			return false;
		};

		run(dep, dest); 
	});

	function run(dep, dest){

	var wrapper = document.getElementById('wrapper'),
	canvas = document.getElementById('grid'),
	context = canvas.getContext('2d'),
	step = 48,
	startPoint = dep,
	endPoint = dest,
	shortesPath; 		

			/* Розмітка вулиць */			

	canvas.height = 480;
	canvas.width = 480;
	
	context.strokeStyle = 'cyan';
	context.strokeRect(0, 0, canvas.width, canvas.height);

	
	for (var i = 0; i < canvas.width; i += step) {
    	context.moveTo(i, 0);
    	context.lineTo(i, canvas.height);
    	context.stroke();
	}

	for (var i = 0; i < canvas.height; i += step) {
	    context.moveTo(0, i);
	    context.lineTo(canvas.width, i);
	    context.stroke();
	}

			/* Зображення точок маршруту */

	context.fillStyle = 'rgba(46, 204, 113,0.4)';
	context.beginPath();
    context.arc(startPoint[0] * 48, startPoint[1] * -48 + 480, 10, 0, Math.PI*2, true);
    context.moveTo(endPoint[0] * 48 + 10, endPoint[1] * -48 + 480);
    context.arc(endPoint[0] * 48, endPoint[1] * -48 + 480, 10, 0, Math.PI*2, true);
    context.fill();
    context.closePath()

    function Path(){
    	this.start = startPoint;
    	this.end = endPoint;
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
    if(isInteger(startPoint[0])){
    	firstPath.firstPoint[1] = Math.floor(startPoint[1]);
    	secondPath.firstPoint[1] = Math.ceil(startPoint[1]); 
    	firstPath.firstPoint[0] = secondPath.firstPoint[0] = startPoint[0];

    } else {    	
    	firstPath.firstPoint[0] = Math.floor(startPoint[0]);
       	secondPath.firstPoint[0] = Math.ceil(startPoint[0]);   
       	firstPath.firstPoint[1] = secondPath.firstPoint[1] = startPoint[1];
    }
    console.log(secondPath.firstPoint, firstPath.firstPoint);

     		/*Визначення координат другої транзитної точки*/
     if(isInteger(endPoint[0])){
     	firstPath.secondPoint[0] = secondPath.secondPoint[0] = endPoint[0];
     	firstPath.secondPoint[1] = firstPath.firstPoint[1];
     	secondPath.secondPoint[1] = secondPath.firstPoint[1];
     
     } else {
     	firstPath.secondPoint[1] = secondPath.secondPoint[1] = endPoint[1];
     	firstPath.secondPoint[0] = firstPath.firstPoint[0];
     	secondPath.secondPoint[0] = secondPath.firstPoint[0];
     }

     		/* Визначення найкоротшого маршруту */
     
     shortesPath = (length(firstPath) > length(secondPath)) ? secondPath : firstPath;

     		/*Зображення маршруту*/

     	context.beginPath();
     	context.lineWidth = 4;
     	context.strokeStyle = 'red';
     	context.moveTo(startPoint[0] * 48, startPoint[1] * -48 + 480);
	    context.lineTo(shortesPath.firstPoint[0] * 48, shortesPath.firstPoint[1] * -48 + 480);
	    context.lineTo(shortesPath.secondPoint[0] * 48, shortesPath.secondPoint[1] * -48 + 480);
	    context.lineTo(endPoint[0] * 48, endPoint[1] * -48 + 480);
	    context.stroke();

	    	/* Підписи координат початку і кінця маршруту */

	    context.fillStyle = "#fff";
	    context.font = 'italic 25px sans-serif';
	    if (startPoint[0] > endPoint[0]){
	    	context.textAlign = "left";
	    	context.fillText("(" + startPoint[0] + ", " + startPoint[1] + ")", startPoint[0] * 48 + 15, startPoint[1] * -48 + 480);
	    } else {
	    	context.textAlign = "right";
	    	context.fillText("(" + startPoint[0] + ", " + startPoint[1] + ")", startPoint[0] * 48 - 15, startPoint[1] * -48 + 480);
	    };
	    if (startPoint[0] <= endPoint[0]){
	    	context.textAlign = "left";
	    	context.fillText("(" + endPoint[0] + ", " + endPoint[1] + ")", endPoint[0] * 48 + 15, endPoint[1] * -48 + 480);
	    } else {
	    	context.textAlign = "right";
	    	context.fillText("(" + endPoint[0] + ", " + endPoint[1] + ")", endPoint[0] * 48 - 15, endPoint[1] * -48 + 480);

	    };	    

	    $("header h5").html('The shortest path is ' + length(shortesPath));
	    $(".start button").html('Try again');

	    console.log(length(shortesPath));
	};
});