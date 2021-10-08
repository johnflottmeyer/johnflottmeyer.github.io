// JavaScript Document
$("#loading").spin();

$(document).ready(function() {
	
	$("#loading").spin(false);
	$("#loading").hide();
	$("#begin").show();
	
	/*************************HELPER FUNCTIONS*******************************/
	//shuffle function
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	
	shuffle = function(o){ //v1.0
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	//remove an item from the array
	removeByIndex = function(arr,index) {
		//removed = arr.splice(index, 1);
		//alert(removed);
		arr.splice(index, 1);
	};
	function ConfirmDialog(message){
			/*var retVal = confirm(message + " ?");
		   if( retVal == true ){
			  $("#cardgutter ul").html("");
			  createDeck();
			  getCard();
			  return true;
		   }else{
			  return false;
		   }*/
		   $("#redogame").show();
    };
	
	/************************* INIT VARIABLES *******************************/
	var startCard = "";
	var openCard = "";
	var debug = "false";
	
	//deck variables
	var shuffledDeck = new Array();
	var suits = new Array("H","D","C","S");
	var startDeck = new Array("A","2","3","4","5","6","7","8","9","10","J","Q","K");
	var deckCount = 0;
	var shuffleCount = 0;
	
	var lineONE = new Array();
	var lineTWO = new Array();
	var lineTHREE = new Array();
	var lineFOUR = new Array();
	
	var firstCardTwo = "";
	var firstCardThree = "";
	var firstCardFour = "";
	
	var startclass = "";
	
	var oneSuit = "";
	var twoSuit = "";
	var threeSuit = "";
	var fourSuit = "";
	
	var openValue = "";
	var line1Spacing = 0;
	var shuffleamount = 3;
	
	/************************* CLEAN THE DECK FOR A RESET *******************************/
	function flushDeck(){
		//###CLEAN UP*****//
		oneSuit = "";
		twoSuit = "";
		threeSuit = "";
		fourSuit = "";
		
		//clear cards
		lineONE = new Array();
		lineTWO = new Array();
		lineTHREE = new Array();
		lineFOUR = new Array();
		
		//clear startcards
		firstCardTwo = "";
		firstCardThree = "";
		firstCardFour = "";
		deckCount = 0;//clear deckCount
		shuffleCount = 0;
		
		$("#row1 ul").html("<li></li>");//clear out old card
		$("#row2 ul").html("<li></li>");//clear out old card
		$("#row3 ul").html("<li></li>");//clear out old card
		$("#row4 ul").html("<li></li>");//clear out old card
		
		//clear out the badges and remove the green highlights
		$(".Hbadge").html("0").removeClass('badge-success');
		$(".Dbadge").html("0").removeClass('badge-success');
		$(".Cbadge").html("0").removeClass('badge-success');
		$(".Sbadge").html("0").removeClass('badge-success');

		$("#win").hide("fast");
		$("#redogame").hide("fast");
		$(".getCard").removeClass("disabled");
		$("#cardgutter").hide("fast");
	}
	/************************* CREATE THE DECK *******************************/
	function createDeck(){
		
	$("#newGame").show();
		flushDeck();//clear out the old stored values
		//$("#save").show();
		var myDeck = new Array();//creat the deck
		for(i=0;i<suits.length;i++){
			for(j=0;j<startDeck.length;j++){
				myDeck.push(startDeck[j]+" "+suits[i]);
			}
		}
		shuffledDeck = shuffle(myDeck);//shuffle the cards
		startCard = shuffledDeck[0];//pick one as the start card.
		
		openCard = shuffledDeck[0].split(" ");//this is the card that can open the rows
		var mySuit = startCard.split(" ");//figure out what the suit is
		lineONE.push(shuffledDeck[0]);
		
		$("#row1 ul").append("<li><a href='#' class='lockedcards'><div class='card cardspace0 suit"+mySuit[1]+" "+mySuit[0]+"' id='"+mySuit[1]+"'>"+mySuit[0]+"</div></a></li>");
		removeByIndex(shuffledDeck,0);//remove the first card from the shuffled deck array?
		
		lineOneSuit = mySuit[1];//announce what suit the first line is
		
		//now place 4 sets of 4 cards on the left 
		var gutterCount = 0;
		
		for(x=0;x<4;x++){
			//clear space
			$("#gutterspace"+(x)+" ul").html("");
			$("#gutterspace"+(x)+" ul li").css("top",0);
			
			for(y=0;y<4;y++){//grab out 20 values from the array
				gutterCount ++;
				var mySuit = shuffledDeck[gutterCount].split(" ");//attach a suit
				suitclass = mySuit[1];//announce what the suit is
				if(y==3){activeClass = "playablecards";}else{activeClass = "lockedcards";}
				$("#gutterspace"+(x)+" ul").append("<li><a href='#' type='"+mySuit[0]+"' class='"+activeClass+"' rel='"+suitclass+"' title='upper'><div class='card gutterspace"+y+" suit"+ suitclass + "' id='"+y+"'>"+mySuit[0]+"<span class='suit suit"+ suitclass + "'></div></div></a></li>");
			
				removeByIndex(shuffledDeck,gutterCount);//remove these cards from the shuffled deck array
				
				if(debug == true){$("footer").append(shuffledDeck[gutterCount] + ",");}
				
				$("#gutterspace"+(x)+" li a .gutterspace" + y).animate({
					//marginLeft: (22*y)
					//marginLeft: (11*y)
  				},1000, function() {
    				// Animation complete.
					$(this).parent().addClass("cardpos"+y);
 			 	});
			}
			
		}
		$("." + openCard[1] + "badge").html(lineONE.length);
		
	}
	
	/*************************CHECK IS PLAYABLE*******************************/
	function isCardPlayable(suit,card,e,deck){
		
		/*Check for line openers*/
		if(card[0] == startCard[0]){
			if(firstCardTwo == ""){
				firstCardTwo = card + " " + suit;
				$("#row2 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+card+"'>"+card+"</div></li></a>");
				garbageCollection(e,deck);
				lineTWO.push(card);
				
			}else if(firstCardThree == "" && firstCardTwo != card + " " + suit){
				firstCardThree = card + " " + suit;
				$("#row3 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+card+"'>"+card+"</div></li></a>");
				garbageCollection(e,deck);
				lineTHREE.push(card);
				
			}else if(firstCardFour == ""  && firstCardThree != card + " " + suit){
				firstCardFour = card + " " + suit;
				$("#row4 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+card+"'>"+card+"</div></li></a>");
				garbageCollection(e,deck);
				lineFOUR.push(card);
				
			}
			
		}
		/* FIGURE OUT SUITS */
		if(firstCardTwo != ""){twoSuit = firstCardTwo.split(" ");}
		if(firstCardThree != ""){threeSuit = firstCardThree.split(" ");}
		if(firstCardFour != ""){fourSuit = firstCardFour.split(" ");}
		/*Can it go in line one*/
		if(suit == openCard[1]){
			multiplier = lineONE.length;//figure out spacing
			$("#row1 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
			//$("#"+suit+"-"+card).css("marginLeft", (20*multiplier));
			$("#"+suit+"-"+card).parent().addClass("cardpos" + multiplier);
			lineONE.push(card);//add to array
			garbageCollection(e,deck);
			
		}/*line 2?*/
		if(suit == twoSuit[1] && card+" "+suit != firstCardTwo){
				if(jQuery.inArray(card, lineONE) != -1){//now check that they are in the previous array
				
					multiplier = lineTWO.length;//figure out spacing
					$("#row2 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
					//$("#"+suit+"-"+card).css("marginLeft", (20*multiplier));
					$("#"+suit+"-"+card).parent().addClass("cardpos" + multiplier);
					lineTWO.push(card);//add to array
					garbageCollection(e,deck);	
				}
		}/*line 3?*/
		if(suit == threeSuit[1] && card+" "+suit != firstCardThree){
				if(jQuery.inArray(card, lineTWO) != -1){
					multiplier = lineTHREE.length;//figure out spacing
					$("#row3 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
					//$("#"+suit+"-"+card).css("marginLeft", (20*multiplier));
					$("#"+suit+"-"+card).parent().addClass("cardpos" + multiplier);
					lineTHREE.push(card);//add to array
					garbageCollection(e,deck);
				}

		}/*line 4?*/
		if(suit == fourSuit[1] && card+" "+suit != firstCardFour){
				if(jQuery.inArray(card, lineTHREE) != -1){
					multiplier = lineFOUR.length;//figure out spacing
					$("#row4 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
					//$("#"+suit+"-"+card).css("marginLeft", (20*multiplier));
					$("#"+suit+"-"+card).parent().addClass("cardpos" + multiplier);
					lineFOUR.push(card);//add to array
					garbageCollection(e,deck);
				}
		}
		/*check for win
		IF ALL THE ARRAYS ARE FULL SHOW WIN MESSAGE
		*/
		if(lineONE.length == 13 && lineTWO.length == 13 && lineTHREE.length == 13 && lineFOUR.length == 13){
			$("#win").show();
		}
		/*update the badges*/
		if(lineONE.length == 13){
			$("." + openCard[1] + "badge").addClass('badge-success');
		}
		if(lineTWO.length == 13){
			$("." + twoSuit[1] + "badge").addClass('badge-success');
		}
		if(lineTHREE.length == 13){
			$("." + threeSuit[1] + "badge").addClass('badge-success');
		}
		if(lineFOUR.length == 13){
			$("." + fourSuit[1] + "badge").addClass('badge-success');
		}
		
		$("." + openCard[1] + "badge").html(lineONE.length);
		
		if(lineTWO.length != 0){$("." + twoSuit[1] + "badge").html(lineTWO.length);}
		if(lineTHREE.length != 0){$("." + threeSuit[1] + "badge").html(lineTHREE.length);}
		if(lineFOUR != ""){$("." + fourSuit[1] + "badge").html(lineFOUR.length);}
		
	}
	
	/*NEW */
	function garbageCollection(removed,deck,amount){
		removed.parent().prev().children("a").addClass("playablecards");
		removed.parent().prev().children("a").removeClass("lockedcards");
		if(deck == "lower"){
			removed.parent().addClass("temphide");
			removed.addClass("lockedcards");
			removed.removeClass("playablecards");
		}else{
			removed.parent().remove();
		}
	}
	
	/*************************BUTTON ACTIONS*******************************/
	$(".startGame").click(function() {
	  $("#cardgutter ul").html("");
	  createDeck();
	  getCard();
	 $(this).parent().hide();
	});
	$(".replayGame").click(function() {
	  $("#cardgutter ul").html("");
	  createDeck();
	  getCard();
	});
	
	$(".newGame").click(function() {
	  //pick a card and show that suit
	  // ConfirmDialog('Are you sure');
	  ConfirmDialog();
	});
	
	
	/************************* LAY OUT DECK *********************************/
	function getCard() {
	  $("#cardgutter").show("slow");
	  $("#options").show("slow");
	  $("#cardgutter ul").html("");  //clear old values
	  errorCount = 0;
		  for(x=0;x<shuffledDeck.length;x++){
		  if(deckCount == shuffledDeck.length){
			  deckCount = 1;
		  }else{
			  deckCount++;
		  }
		  
		var mySuit = shuffledDeck[deckCount-1].split(" ");
			suitclass = mySuit[1];

			$("#cardgutter ul").append("<li class='card"+x+"'><a href='#' type='"+mySuit[0]+"' class='lockedcards' rel='"+suitclass+"' id='"+(deckCount-1)+"' title='lower'><div class='lowercard gutterspace"+y+" suit"+ suitclass + "'>"+mySuit[0]+"<span class='suit suit"+ suitclass + "'></div></div></a></li>");
	  }
	  
			$('#cardgutter li:nth-child('+shuffleamount+'n) a').addClass('playablecards');
			$('#cardgutter li a').last().addClass('playablecards');
	  
	  //now enable the two options with deal
	  $("#undo").show();
	  $("#deal").show();
	}
	
	/******************************DEAL*************************************/
	$(".deal").click(function(){
		
		//hide the first set
		for(x=0;x<shuffleamount;x++){
		  if(shuffleCount == shuffledDeck.length){
			  $("#cardgutter li").each(function(e){//find and remove used cards
				  if($(this).hasClass("temphide")){
					  $(this).remove();
					  removeByIndex(shuffledDeck,$(this).children("a").attr("id"));//now remove from array
				  }
			  });
			  
			  $("#cardgutter li").each(function(){ //turn all the cards back on
				$(this).children().removeClass("playablecards");
				$(this).children().addClass("lockedcards");
			  });
			  
			  //remark every third one
			  $('#cardgutter li:nth-child('+shuffleamount+'n) a').addClass('playablecards');
			  $('#cardgutter li a').last().addClass('playablecards');
			  $("#cardgutter li").each(function(index){ //turn all the cards back on
				//$(this).children().addClass("lockedcards");
				$(this).removeClass();
				$(this).addClass("card" + index);
				$(this).show();
			  });
			  //$("footer").append("###Deck reset###<br>");
			  shuffleCount = 0;
			  break;
		  }else{
			  shuffleCount++;
			  $("#cardgutter .card" + (shuffleCount-1)).hide("fast");//hide the current 3 cards
			  //alert("hiding");
		  }
		 
		}
		//$("footer").append("Deck: "+shuffledDeck+ " " +shuffleCount+"<br>");
		
	});
	
	/******************************UNDO**************************************/
	//pretty much the opposite
	$("#undo").click(function(){

	});
	
	/***************** CHECK CARD ON CLICK *******************************/
	$(".playablecards").live("click", function() {
  		isCardPlayable($(this).attr("rel"),$(this).attr("type"),$(this),$(this).attr("title"));
	});
	$("#card3").live("click", function() {
		$("#card3").addClass("active");
		$("#card5").removeClass("active");
		shuffleamount = 3;
		$("#cardmask").removeClass("elongate");
		$("#cardmask").addClass("cardmask");
		//reset deck
		getCard();
	});
	$("#card5").live("click", function() {
		$("#card3").removeClass("active");
		$("#card5").addClass("active");
		shuffleamount = 5;
		$("#cardmask").addClass("elongate");
		$("#cardmask").removeClass("cardmask");
		//reset deck
		getCard();
		
	});
	$(".closewindow").live("click", function(){
		$("#redogame").hide();
	});
	/*$(".cards a").live("mouseover", function() {
		returny = $(this).parent().css('marginTop');
		$(this).parent().css('marginTop', -10);
		//alert(returnz);
	});
	
	$(".cards a").live("mouseout", function() {
		//alert(returnz);
		$(this).parent().css('marginTop', returny);
	});*/
	
	
});
