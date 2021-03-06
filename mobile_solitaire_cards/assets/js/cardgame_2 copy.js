// JavaScript Document
$("#loading").spin();
$(document).ready(function() {
						
	$("#loading").spin(false);
	$("#loading").hide();
	
	$("#startGame").show();
	//shuffle function
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	
	/*************************HELPER FUNCTIONS*******************************/
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
	
	/*************************INIT VARIABLES*******************************/
	var startCard = "";
	var openCard = "";
	var debug = false;
	
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
	
	var lineOneSuit = "";
	var lineTwoSuit = "";
	var lineThreeSuit = "";
	var lineFourSuit = "";
	
	var openValue = "";
	var line1Spacing = 0;
	
	//
	/*************************CREATE THE DECK*******************************/
	function flushDeck(){
		//###CLEAN UP*****//
		lineOneSuit = "";//clear suits
		lineTwoSuit = "";//clear suits
		lineThreeSuit = "";//clear suits
		lineFourSuit = "";//clear suits
		
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
		
		$("#row1 ul").html("<li></li>");//clear out old card
		$("#row2 ul").html("<li></li>");//clear out old card
		$("#row3 ul").html("<li></li>");//clear out old card
		$("#row4 ul").html("<li></li>");//clear out old card
		
		$(".getCard").removeClass("disabled");
		$("#cardgutter").hide("fast");
	}
	function createDeck(){
		flushDeck();//clear out the old stored values
		$("#save").show();
		var myDeck = new Array();//creat the deck
		for(i=0;i<suits.length;i++){
			for(j=0;j<startDeck.length;j++){
				myDeck.push(startDeck[j]+" "+suits[i]);
			}
		}
		shuffledDeck = shuffle(myDeck);//shuffle the cards
		startCard = shuffledDeck[0];//pick one as the start card.
		
		if(debug == true){$("footer").append("******************DEBUG - Game start ******************<br>picked STARTCARD: "+ startCard +"<br/>");}
		
		openCard = shuffledDeck[0].split(" ");//this is the card that can open the rows
		var mySuit = startCard.split(" ");//figure out what the suit is
		lineONE.push(shuffledDeck[0]);
		//alert(lineONE);
		
		$("#row1 ul").append("<li><a href='#' class='lockedcards'><div class='card cardspace0 suit"+mySuit[1]+" "+mySuit[0]+"' id='"+mySuit[1]+"'>"+mySuit[0]+"</div></a></li>");
		removeByIndex(shuffledDeck,0);//remove the first card from the shuffled deck array?
		
		if(debug == true){$("footer").append("that leaves:<br/> "+ shuffledDeck +"<br/>");}
		if(debug == true){$("footer").append("or "+ shuffledDeck.length +" cards<br/>");}
		
		lineOneSuit = mySuit[1];//announce what suit the first line is
		
		//now place 4 sets of 4 cards on the left 
		var gutterCount = 0;
		
		if(debug == true){$("footer").append("We pick out <br/>");}
		
		for(x=0;x<4;x++){
			//clear space
			$("#gutterspace"+(x)+" ul").html("");
			$("#gutterspace"+(x)+" ul li").css("top",0);
			
			for(y=0;y<4;y++){//grab out 20 values from the array
				gutterCount ++;
				var mySuit = shuffledDeck[gutterCount].split(" ");//attach a suit
				suitclass = mySuit[1];//announce what the suit is
				if(y==3){activeClass = "playablecards";}else{activeClass = "lockedcards";}
				$("#gutterspace"+(x)+" ul").append("<li><a href='#' type='"+mySuit[0]+"' class='"+activeClass+"' rel='"+suitclass+"' title='upper'><div class='cardinner card gutterspace"+y+" suit"+ suitclass + "' id='"+y+"'>"+mySuit[0]+"<span class='suit suit"+ suitclass + "'></div></div></a></li>");
				removeByIndex(shuffledDeck,gutterCount);//remove these cards from the shuffled deck array
				
				if(debug == true){$("footer").append(shuffledDeck[gutterCount] + ",");}
				
				$("#gutterspace"+(x)+" li a .gutterspace" + y).animate({
					marginLeft: (42*y)
  				},1000, function() {
    				// Animation complete.
 			 	});
			}
			
		}
		
		/*$('.playablecards').bind('click', function() {//bind click actions to the cards
  			isCardPlayable($(this).attr("rel"),$(this).attr("type"),$(this),"upper");
		});*/
		/*NEW - create the lower deck*/
		
		if(debug == true){$("footer").append("</br> or " + gutterCount + " cards<br/>that leaves "+ shuffledDeck +" for cards to draw from<br/>");}
		if(debug == true){$("footer").append("or "+ shuffledDeck.length +" cards<br/>");}
		
	}
	
	/*************************CHECK IS PLAYABLE*******************************/
	function isCardPlayable(suit,card,e,deck){
		//alert(deck);
		if(card[0] == startCard[0]){
			if(firstCardTwo == ""){
				firstCardTwo = card + " " + suit;
				$("#row2 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+card+"'>"+card+"</div></li></a>");
				garbageCollection(e,deck);
				/*e.parent().remove();
				if(deck = "lower"){
				 	removeByIndex(shuffledDeck,e.attr("id"));
				}*/
				lineTWO.push(card);
				
				if(debug == true){$("footer").append("*line two opened with "+ card +" " + suit + "<br/>");}
				
			}else if(firstCardThree == "" && firstCardTwo != card + " " + suit){
				firstCardThree = card + " " + suit;
				$("#row3 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+card+"'>"+card+"</div></li></a>");
				garbageCollection(e,deck);
				/*e.parent().remove();
				if(deck = "lower"){
				 	removeByIndex(shuffledDeck,e.attr("id"));
				}*/
				lineTHREE.push(card);
				
				if(debug == true){$("footer").append("*line three opened with "+ card +" " + suit + "<br/>");}
				
			}else if(firstCardFour == ""  && firstCardThree != card + " " + suit){
				firstCardFour = card + " " + suit;
				$("#row4 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+card+"'>"+card+"</div></li></a>");
				garbageCollection(e,deck);
				/*e.parent().remove();
				if(deck = "lower"){
				 	removeByIndex(shuffledDeck,e.attr("id"));
				}*/
				lineFOUR.push(card);
				
				if(debug == true){$("footer").append("*line four opened with "+ card +" " + suit + "<br/>");}
				
			}
			
		}
		
		if(firstCardTwo != ""){twoSuit = firstCardTwo.split(" ");}
		if(firstCardThree != ""){threeSuit = firstCardThree.split(" ");}
		if(firstCardFour != ""){fourSuit = firstCardFour.split(" ");}
		
		if(suit == openCard[1]){
			multiplier = lineONE.length;//figure out spacing
			$("#row1 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
			$("#"+suit+"-"+card).css("marginLeft", (24*multiplier));
			lineONE.push(card);//add to array
			//remove from source
			e.parent().prev().children("a").addClass("playablecards");
			e.parent().prev().children("a").removeClass("lockedcards");
			e.parent().remove();
			if(deck == "lower"){
				 	removeByIndex(shuffledDeck,e.attr("id"));
			}
			
			
			if(debug == true){$("footer").append("* Card played on line one "+card+" "+suit+ " -- " + lineONE.length + "from " + deck +" cards in the line.<br/>");}
			if(debug == true){$("footer").append(lineONE+"<br>");}
			
		}
			if(suit == twoSuit[1] && card+" "+suit != firstCardTwo){
				if(jQuery.inArray(card, lineONE) != -1){//now check that they are in the previous array
				
					multiplier = lineTWO.length;//figure out spacing
					$("#row2 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
					$("#"+suit+"-"+card).css("marginLeft", (24*multiplier));
					lineTWO.push(card);//add to array
					//remove from source
					garbageCollection(e,deck);
					/*e.parent().remove();
					if(deck == "lower"){
						alert(e.attr("id"));
						removeByIndex(shuffledDeck,e.attr("id"));
					}*/
					
					if(debug == true){$("footer").append("* Card played on line two "+card+" "+suit+ " -- " + lineTWO.length  + "from " + deck +" cards in the line.<br/>");}
					
				}
		}
			
		if(suit == threeSuit[1] && card+" "+suit != firstCardThree){
				if(jQuery.inArray(card, lineTWO) != -1){
					multiplier = lineTHREE.length;//figure out spacing
					$("#row3 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
					$("#"+suit+"-"+card).css("marginLeft", (24*multiplier));
					lineTHREE.push(card);//add to array
					garbageCollection(e,deck);
					/*e.parent().remove();
					if(deck == "lower"){
						removeByIndex(shuffledDeck,e.attr("id"));
					}*/
				}
				if(debug == true){$("footer").append("* Card played on line three "+card+" "+suit+ " -- " + lineTHREE.length  + "from " + deck +" cards in the line.<br/>");}
		}
		//if(firstCardFour != "" && card+" "+suit != firstCardFour && suit == fourSuit[1]){
			if(suit == fourSuit[1] && card+" "+suit != firstCardFour){

			if(jQuery.inArray(card, lineTHREE) != -1){
					multiplier = lineFOUR.length;//figure out spacing
					$("#row4 ul").append("<li><a href='#' class='lockedcards' rel='"+suit+"'><div class='cardinner card gutterspace suit"+ suit + "' id='"+suit+"-"+card+"'>"+card+"<span class='suit suit"+ suit + "'></div></div></li></a>");
					$("#"+suit+"-"+card).css("marginLeft", (24*multiplier));
					lineFOUR.push(card);//add to array
					//remove from source
					garbageCollection(e,deck);
					/*e.parent().remove();
					if(deck == "lower"){
						removeByIndex(shuffledDeck,e.attr("id"));
					}*/
				}
				if(debug == true){$("footer").append("* Card played on line four "+card+" "+suit+ " -- " + lineFOUR.length  + "from " + deck +" cards in the line.<br/>");}
		}
	}
	//open up next card
	/*
	If card played run through row and open up next card
	*/
	function garbageCollection(removed,deck){
		removed.parent().remove();
		if(deck == "lower"){
			removeByIndex(shuffledDeck,removed.attr("id"));
		}
	}
	
	
	/*************************BUTTON ACTIONS*******************************/
	$(".startGame").click(function() {
	  //pick a card and show that suit
	  $("#cardgutter ul").html("");
	  createDeck();
	  //first alert to user. 
	  $("#feedback").html("<div class='alert' id='alertstart'><a class='close' data-dismiss='alert' data-target='#alertstart'>x</a><strong>Hooray!</strong> Your game has begun. The start card is " + startCard + "</div>");
	  $("#feedback").show("slow");
	  getCard();
	  $(this).html("Reset");
	});
	
	/*************************CHOOSE A CARD*********************************/
	function getCard() {
	  $("#cardgutter").show("slow");
	  $("#cardgutter ul").html("");  //clear old values
	  if(debug == true){$("footer").append("Deck: "+shuffledDeck+"<br>");}
	  errorCount = 0;
		  for(x=0;x<shuffledDeck.length;x++){
		  if(deckCount == shuffledDeck.length){
			  deckCount = 1;
		  }else{
			  deckCount++;
		  }
		  
		var mySuit = shuffledDeck[deckCount-1].split(" ");
			suitclass = mySuit[1];
			//alert(((x)%3 == true) + " -- " + x);
			if((x == 2) || (x == 5) || (x == 8) || (x == 11) || (x == 14) || (x == 17) || (x == 20) || (x == 23) || (x == 26) || (x == 29) || (x == 32) || (x == 34) && deckCount != 0){activeClass = "playablecards";}else{activeClass = "lockedcards";}
            

			$("#cardgutter ul").append("<li class='card"+x+"'><a href='#' type='"+mySuit[0]+"' class='"+activeClass+"' rel='"+suitclass+"' id='"+(deckCount-1)+"' title='lower'><div class='cardinner lowercard gutterspace"+y+" suit"+ suitclass + "'>"+mySuit[0]+"<span class='suit suit"+ suitclass + "'></div></div></a></li>");
			$("#cardgutter > *:nth-child(3n)").addClass("blurb");
	  }
	  
	  
	  //now enable the two options with deal
	  $("#undo").show();
	  $("#deal").show();
	}
	
	/******************************DEAL*************************************/
	$("#deal").click(function(){
		//hide the first set
		for(x=0;x<3;x++){
		  if(shuffleCount == shuffledDeck.length){
			  shuffleCount = 0;
			  $("#cardgutter li").each(function(){ //turn all the cards back on
				$(this).show();
			  });
		  }else{
			  shuffleCount++;
			  $("#cardgutter .card" + (shuffleCount-1)).hide("slow");//hide the current 3 cards
		  }
		 
		}
		$("footer").append("Deck: "+shuffledDeck+ " " +shuffleCount+"<br>");
		
	});
	
	/******************************UNDO**************************************/
	//pretty much the opposite
	$("#undo").click(function(){
		/*if(shuffleCount != 0){shuffleCount = shuffleCount-3;}
		
		//hide the first set
		for(x=3;x>0;x--){
		  if(shuffleCount == shuffledDeck.length){
			  shuffleCount = 0;
			  //turn all the cards back on
			  $("#cardgutter li").each(function(){
				$(this).show();
			  });
			 // alert("startover");
		  }else{
			  //shuffleCount++;
			  $("#cardgutter .card" + (shuffleCount-1)).show("slow");
		  }
		  
		}
		$("footer").append("Deck: "+shuffledDeck+ " " +shuffleCount+"<br>");*/
		
		
	});
	
	/***************** CHECK CARD *******************************/
	//check that I'm sending the deck position vs assuming it's "lower"
	$(".playablecards").live("click", function() {
  			isCardPlayable($(this).attr("rel"),$(this).attr("type"),$(this),$(this).attr("title"));
	});
	
	
});
