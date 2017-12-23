$(function () {
	// FORMAT: <canvas class="user-icon" data-icon='{"size": "150", "color" : "red"}'></canvas>
	$('.user-icon').each(function () {
		var iconData = JSON.parse($(this).attr('data-icon'));
		var size = iconData.size;
		$(this).attr({width: size,height: size});
		uico = $(this)[0].getContext('2d');
		uico.strokeStyle = iconData.color;
		uico.fillStyle = iconData.color;
		uico.beginPath();
		uico.arc((size/2),(size/4),(size/7),0,2*Math.PI,true);
		uico.closePath();
		uico.fill();
		uico.stroke();
		uico.beginPath();
		uico.arc((size/2),(size/1.15),(size/2.2),0,1*Math.PI,true);
		uico.closePath();
		uico.fill();
		uico.stroke();
	})
	// FORMAT: <canvas class="justify-icon" data-icon='{"size":"20", "color": "white", "lines":"3"}'></canvas>
	$('.justify-icon').each(function(i, elA) {
		var iconData = JSON.parse($(this).attr('data-icon'));
		var size = iconData.size;
		var lines = iconData.lines;
		if (lines == undefined) {
			lines = 3;
		}
		$(this).attr({width: size,height: size});
		uico = $(this)[0].getContext('2d');
		uico.fillStyle = iconData.color;
		uico.fillStyle = iconData.color;
		var strtpos = 0;
		var hight = 0;
		for (var j = 0; j < lines; j++) {
			uico.fillRect(0,strtpos,size,size/(2*lines-1));
			strtpos = (2*(j+1))*size/(2*lines-1);
		}
	});
})