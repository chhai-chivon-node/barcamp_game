var countPlayer = 0;
var p = "";
var selector = "";
var av_move = {
	'tl':['c','tr','bl'],
	'tr':['c','tl'],
	'c':['tl','tr','bl','br'],
	'bl':['c','tl','br'],
	'br':['c','bl']
};
var socket = io.connect('http://localhost:3000');
socket.on('countplayer', function (obj) {
	countPlayer = obj.count;
	$(".home button[p='"+obj.player+"']").prop('disabled', true);
	if(countPlayer == 2){ 
		startgame();
		if(p == 1){
			togglePlay(true);
		}
	}
});
socket.on('move', function (obj) {
	go(obj);
	if(obj.player == p){		
		togglePlay(false);
	}else{
		togglePlay(true);
		check_way();
	}
});
socket.on('win', function (obj) {
	$("#win").show();
});
$(function(){		
	$("#_cda_home button").click(function(){		
		p = $(this).attr('p');
		selector = $("button.player.p"+p);
		$('#_cda_wait .wait').prepend($(this).html());
		$('#_cda_wait').animate({"margin-left": '0'});
		$('#_cda_home').animate({"margin-top": '-100%'});
		countPlayer += 1;
		socket.emit('countplayer', {count:countPlayer,player:p});
	});
});
function togglePlay(status){
	if(status == true){
		selector.prop('disabled', false);
		$(".game-gurd").addClass('active');
		$(".game-gurd").html("Your Time!");
	}else{
		selector.prop('disabled', true);
		$(".game-gurd").removeClass('active');
		$(".game-gurd").html("Wait your opponents move!");
	}
}
function startgame(){
	var body_h = $("body").height();
	$(".game").height((body_h*60)/100);	
	$('#_cda_wait').animate({"margin-top": '-100%'});
	$('#_cda_home').animate({"margin-top": '-100%'});
	$('#_cda_game').animate({"margin-left": '0'});
	init();
}
function init(){
	$(document).click(function(e){
		selector.removeClass("active");
	});
	selector.click(function(e){
		selector.removeClass("active");
		$(this).addClass("active");
		e.stopPropagation();
	});
	
	$("button.area").click(function(e){
		var player = $("button.player.active");
		if(player.length != 1) return ;				
		var f_p = player.attr("p");
		var t_p = $(this).attr("p");
		if(av_move[f_p].includes(t_p)){
			socket.emit('move', {pfrom:f_p,pto:t_p,player:p});
			//go({pfrom:f_p,pto:t_p,player:p});
		}else{
			alert("Not Allowed");
		}
	});
	setTimeout(function(){ 
		go({"pfrom":"tl","pto":'tl'});
		go({"pfrom":"tr","pto":'tr'});
		go({"pfrom":"bl","pto":'bl'});
		go({"pfrom":"br","pto":'br'});
	}, 1000);	
}
function check_way(){
	var stat = false;
	selector.each(function(){
        var pos = $(this).attr("p");
		$.each(av_move[pos], function( k, v ) {
			if($("button.area[p='"+v+"']:enabled").length > 0){
				stat = true;
				return false;
			}
		});
		
    });
	if(stat === false){
		socket.emit('win', {});
		$("#lose").show();
	}
}
function go(obj){
	var pfrom = obj.pfrom,
		pto = obj.pto;
	var div_w = $(".game").width(),
		div_h = $(".game").height(),				
		gtop = 0,
		gleft = 0;
		
	switch(pto){
		case 'tl':
			gtop = ((div_h * 0)/100)-55;
			gleft = ((div_w * 0)/100)-22; 
		break;
		case 'tr':
			gtop = ((div_h * 0)/100)-55;
			gleft = ((div_w * 100)/100)-22;
		break;
		case 'c':
			gtop = ((div_h * 50)/100)-55;
			gleft = ((div_w * 50)/100)-22;
		break;
		case 'bl':
			gtop = ((div_h * 100)/100)-55;
			gleft = ((div_w * 0)/100)-22;
		break;
		case 'br':
			gtop = ((div_h * 100)/100)-55;
			gleft = ((div_w * 100)/100)-22;
		break;
	}
	
	$('button.player[p="'+pfrom+'"]').animate({
			left: gleft,
			top: gtop
		 },
		 {
			duration: 1000,
			start: function() {
				$(".area[p='"+pfrom+"']").prop('disabled', false);
				$(".area[p='"+pto+"']").prop('disabled', true);
				$(this).attr('p',pto);
			},
			complete: function() {
				
			},
			progress: function(animation, progress) {
			  
			}
		 }
	  );
}