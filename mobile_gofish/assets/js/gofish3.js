/*GOFISH 1.0 
Written for Gibsons Water Care Gibby. 
By John Flottmeyer for Voila! Media Group 
2014

//DEBUG VARIABLES
//Removal
//userbook
//aibook
//compare
///switch these to console log - commented out for now. 
*/

// At the top of your script:
if ( ! window.console ) console = { log: function(){} };
// If you use other console methods, add them to the object literal above

/*SET UP STUFF TESTING*/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        StatusBar.overlaysWebView(false);
    }
};

/*************************HELPER FUNCTIONS*******************************/
//shuffle function
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};
//REMOVE FROM ARRAY BY POSITION
removeByIndex = function(arr,index) {//remove an item from the array
	arr.splice(index, 1);
};
//GET A RANDOM NUMBER IN A RANGE
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//COMPARE FUNCTION 
function compare(a, b) {
	 if ( a > b ) return 1;
    if ( b > a ) return -1;
    return 0;
}

/*************************GAME INIT VARIABLES*******************************/
//////////////// Initial Variables
//deck variables
var gameInProgress = false;//not sure if Im going to use this would be related to a saved game - future
var AISmarts = 50;//variable to determine probability of guessing right cards based on users previous guesses. - future 
var HandNum = 7;//deck for each hand

var AIHand = new Array(); //current cards in hand
var USERHand = new Array(); //current cards in hand
var checkArr = new Array(); //use this array to check for matches of 4
var AInewhand = "";
var USERnewhand = "";

//store the totals
var AIbookTotal = new Array();
var USERbookTotal = new Array();

var CurrentTurn = "USER"; //start the turn on the USERS turn

//DECK STORAGE
var shuffledDeck = new Array();
var goFishDeck = new Array();
//DECK VARIABLES
var suits = new Array("H","D","C","S");
var startDeck = new Array("A","2","3","4","5","6","7","8","9","10","J","Q","K");
var deckCount = 0;
var shuffleCount = 0;
var customName = "You";

/*************************RESET THE GAME*******************************/
function reset(){
	//remove current settings - then start the game over. 
	AIHand = new Array(); 
	USERHand = new Array();
	checkArr = new Array(); 
	AInewhand = "";
	USERnewhand = "";
	
	//store the totals
	AIbookTotal = new Array();
	USERbookTotal = new Array();
	
	CurrentTurn = "USER"; 
	
	//DECK STORAGE
	shuffledDeck = new Array();
	goFishDeck = new Array();
	
	$("#userbooks .booktotal").html(0);
	$("#dealerbooks .booktotal").html(0);
	
	deckCount = 0;
	shuffleCount = 0;
	//clear out html elements
	$("#dealerhand").html("");
	updateDeck();
	$("#newuserhand").each(function() {
		$(this).find(".ui-count").text(0);
	});
	$("#newuserhand a").each(function() {
		$(this).removeClass("ui-complete");
		$(this).attr("href","#popupInfo");
	});
	$("#newuserhand .suits span").each(function() {
		$(this).addClass("ui-disabled");
	});
	startGame();
	
}
function startGame(){
	var myDeck = new Array(); //create the deck
	for(a=0;a<suits.length;a++){
		for(b=0;b<startDeck.length;b++){
			myDeck.push(startDeck[b]+" "+suits[a]);
		}
	}
	shuffledDeck = shuffle(myDeck); //shuffle the cards
	
	//DEAL CARDS
	for(c=0;c<HandNum;c++){ //AI HAND OF CARDS 
		AIHand.push(shuffledDeck[c]);
		removeByIndex(shuffledDeck,c);//remove these cards from the shuffled deck array
	}
	AIHand.sort(compare);
	for(d=0;d<AIHand.length;d++){
		AInewhand += "<li class='card'></li>";
	}
	$("#dealerhand").html("<ul class='deck'>"+AInewhand+"</ul>"); //END AI HAND
	
	for(b=0;b<HandNum;b++){ //USER HAND DECK
		USERHand.push(shuffledDeck[b]);
		removeByIndex(shuffledDeck,b);//remove these cards from the shuffled deck array
	}
	USERHand.sort();//arrange them nice
	
	for(e=0;e<USERHand.length;e++){
		var getsuit = USERHand[e].split(" ");
		$("#newuserhand a."+ getsuit[0]).removeClass("ui-disabled");//enable the deck
		var currentNum = $("#newuserhand a."+ getsuit[0] + " .ui-count").text();//get the current count (0)
		$("#newuserhand a."+ getsuit[0] + " .ui-count").html(Number(currentNum) + 1);//add to that number for each card added
		$("#newuserhand a."+ getsuit[0] + " span."+getsuit[1].toLowerCase()).removeClass("ui-disabled");//enable the suit
	} //END USER HAND DECK
	
	//GO FISH PILE - FOR DEBUG ONLY 
	var go = "";
	for(f=0;f<shuffledDeck.length;f++){
		go += ',' + shuffledDeck[f] + ' ';
	}
	console.log('GoFish Deck:' + go);
}

/*************************CHECK FOR BOOKS*******************************/
function check4four(){
	////$(".compare").append("<li> -- start check 4: " + CurrentTurn + "</li>");
	//loop through current player hand
	var currHand = window[CurrentTurn + 'Hand'];
	var checkArr = new Array();
	//window[currHand + 'Arr'] = new Array(); //create a new array variable for each turn so that they don't interfere with each other.
	for(k=0;k<currHand.length;k++){
		var single = currHand[k].split(" ");
		checkArr.push({
			label:single[0],
			card:currHand[k]
		});
	}
	
	//now loop through this array and check for duplicates
	//sort them first
	checkArr.sort(function(a, b) {
    	var textA = a.label.toUpperCase();
		var textB = b.label.toUpperCase();
		return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});
    //http://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
    
	var current = null;
    var cnt = 0;
    for (var n = 0; n < checkArr.length; n++) {
        if (checkArr[n].label != current) {
            current = checkArr[n].label;
            cnt = 1;
        } else {
            cnt++;
        }
        if(cnt > 3){
			createbook(current,CurrentTurn);
			toastr.success(CurrentTurn + ': 4 of a kind ' + current, null, {target: $('.turn span p'),"timeOut": "1000","positionClass": "toast-top-full-width"});
			$(".response").append("<li>4 of a kind: " + current + "</li>");
        }
        ////$(".compare").append("<li> -- --  checking: " + checkArr[n].label + " : " + cnt + "</li>");
    }
    updateDeck();
}

/*************************CREATE A BOOK*******************************/
function createbook(book,who){
	if(who == "USER"){
		USERbookTotal.push(book); //store in an array
		var usercurrentBooks = Number(USERbookTotal.length);
		////$(".userbook").append(book + ", ");//debug info
		$("#userbooks .booktotal").html(usercurrentBooks); //debug
		$("#newuserhand a."+book).attr("href","#"); //disable the button
		$("#newuserhand a."+book).addClass("ui-complete"); //add class to it
		
		/*mark it as 4*/
		$("#newuserhand a."+book+" .ui-count").text(4);//make the count at four
		$("#newuserhand a."+book+" .suits span").removeClass("ui-disabled");//highlight all the suits
		
		//make the suit jump
		$("#newuserhand a."+book).animate({ bottom: "+=20"}, 500, function() {//move it up
			$("#newuserhand a."+book).animate({ bottom: "-=20" }, 500, function() {//move it back down
				
			});
		});
		//find and remove these cards
		var removeEM = new Array();
		for(i=0;i<USERHand.length;i++){
			var single = USERHand[i].split(" ");
			//$(".compare").append("<li>" + book + "-" + single[0] + "</li>");
			if(book == single[0]){ //this isn't always catching the right thing
			//if(Number(book) == Number(single[0])){
				//remove these ones
				////$(".compare").append("<li>" + book + "-" + single[0] + "</li>");
				removeEM.push(USERHand[i]);
			}
		}
		//$(".removal").html(removeEM);
		for(o=0;o<removeEM.length;o++){
			////$(".removal").append("<li>Book: " + CurrentTurn + " removed " + removeEM[o] + "</li>");
			var pos = $.inArray(removeEM[o],USERHand);
			removeByIndex(USERHand,pos);
		}
		updateDeck();
	}else{ //temporary so that I can see 
		AIbookTotal.push(book); //store in an array
		var aicurrentBooks = Number(AIbookTotal.length);
		////$(".aibook").append(book + ", "); //debug info
		$("#dealerbooks .booktotal").html(aicurrentBooks); 
		//find and remove these cards
		var airemoveEM = new Array();
		for(j=0;j<AIHand.length;j++){
			var single = AIHand[j].split(" ");
			//$(".compare").append("<li>" + book + "-" + single[0] + "</li>");
			if(book == single[0]){ //particularly Gibby has trouble with Q
			//if(Number(book) == Number(single[0])){
				//remove this one
				$(".compare").append("<li>" + book + "-" + single[0] + "</li>");
				airemoveEM.push(AIHand[j]);
			}
		}
		//$(".removal").html(airemoveEM);
		for(p=0;p<airemoveEM.length;p++){
			////$(".removal").append("<li>Book: " + CurrentTurn + " removed " + airemoveEM[p] + "</li>");
			var pos = $.inArray(airemoveEM[p],AIHand);
			removeByIndex(AIHand,pos);
		}
		updateDeck();
	}
}

/*************************SEARCH THE CARDS*******************************/
//look through the two hands depending on the turn to see if the searched for card is in there.
function searchCards(whosturn,card){

	isEnd();
	
	var foundArr = new Array();
	var foundCount = 0;
	var WhosTurn = "";
	var label = "";
	
	if(whosturn == "USER"){WhosTurn = "AI";}else{WhosTurn = "USER";}
	var handArray = window[WhosTurn + "Hand"];
	
	for(m=0;m<handArray.length;m++){
		var curCard = handArray[m].split(" ");
		if(curCard[0] == card){
			foundArr.push(handArray[m]);
			foundCount++;
		}
	}
	
	if(whosturn == "USER"){label = customName;}else{label = "Gibby";}
	$(".response").append("<li>" + label + " asked for " + card + "</li>");//normalize the turn listing
	if(foundCount > 0){ //something was found add it to the decks
		var foundMessage = new Array();
		for(n=0;n<foundArr.length;n++){
			moveCard(foundArr[n]);
			foundMessage.push(foundArr[n]);
		}
		//now do message here instead
		if(CurrentTurn == "USER"){user = customName;}else{user = "Gibby";}
		toastr.success(user + ' found ' + foundMessage, null, {target: $('.turn span p'),"timeOut": "1000","positionClass": "toast-top-full-width"});
		
		$(".response").append("<li> -- "+user+" found - " + foundMessage + "</li>");
		
		//something was found check for 4
		
		check4four();
		updateDeck();
		isEnd();//is the game over now?
		//if it's Gibby go again
		if(whosturn == "AI"){
			gibbytaketurn(); //remind Gibby to to again he's found a card
		}
	}else{
		var returnedCard = goFish(card);
	}
}

/*************************MOVE CARD TO DECK*******************************/
//move a card over from the other deck
function moveCard(foundCard){
	window[CurrentTurn + 'Hand'].push(foundCard); //add card to array
	window[CurrentTurn + 'Hand'].sort();
	
	if(CurrentTurn == "USER"){
		 //REMOVE LATER - DEBUG INFO
		var pos = $.inArray(foundCard,AIHand);
		removeByIndex(AIHand,pos);
		////$(".removal").append("<li>Moved: --" + foundCard + ": Removed from AIHand</li>"); //REMOVE LATER - DEBUG INFO
	}else{
		var pos = $.inArray(foundCard,USERHand);
		removeByIndex(USERHand,pos);
		////$(".removal").append("<li>Moved: --" + foundCard + ": Removed from USERHand</li>"); //REMOVE LATER - DEBUG INFO
		//zero out the users card status
		var checkCard = foundCard.split(" ");
		$("#newuserhand a." + checkCard[0] + " .suits span").addClass("ui-disabled");
		$("#newuserhand a." + checkCard[0] + " .ui-count").text(0); 
	}
	// temp disabled - moved updateDeck to the check4four function - updateDeck(); //now run through the decks and highlight the found cards
}
/*************************CHECK FOR END OF GAME****************************/
function isEnd(){
	if(shuffledDeck.length == 0 || AIHand.length == 0 || USERHand.length == 0){//check to see if his hand is empty
		whoWon();
		return;
	}
}
/*************************CHECK FOR A WINNER*******************************/
function whoWon(){
	var UserNum = Number(USERbookTotal.length);
	var AiNum = Number(AIbookTotal.length);
	if(AiNum > UserNum){
		//alert("Gibby Wins! " + AiNum + " to " + UserNum);
		$(":mobile-pagecontainer").pagecontainer("change","#win",{
			reload: false,
			transition: 'slideup'
		});
		$("#win .winner").text("Gibby Wins!");
		$("#win .details").text("Final Score: " + AiNum + " to " + UserNum);
		
	}else if(AiNum < UserNum){
		//alert("You Win! " + UserNum + " to " + AiNum);
		$(":mobile-pagecontainer").pagecontainer("change","#win",{
			reload: false,
			transition: 'slideup'
		});
		$("#win .winner").text(customName + " Wins!");
		$("#win .details").text("Final Score: " + UserNum + " to " + AiNum);
	}else if(AiNum == UserNum){
		$(":mobile-pagecontainer").pagecontainer("change","#win",{
			reload: false,
			transition: 'slideup'
		});
		$("#win .winner").text("Draw!");
		$("#win .details").text("Final Score: " + UserNum + " to " + AiNum);
	}
}

/*************************UPDATE DECKS*******************************/
// update hand of current turn
function updateDeck(){ 

	/*DEBUG INFO*/
	var displaydebug = "";
	$.each(AIHand, function( i, val ) { displaydebug += '&nbsp;' + val + '&nbsp;'; });
	$(".aihanddebug").html(displaydebug);
	
	displaydebug = "";
	$.each(USERHand, function( i, val ) { displaydebug += '&nbsp;' + val + '&nbsp;'; });
	$(".userhanddebug").html(displaydebug);
	/*END DEBUG INFO*/
	
	/*Check for complete sets*/
	
	//disable them all to start
	$("#newuserhand a").addClass("ui-disabled"); //disables all buttons
	$("#newuserhand a .menu span").addClass("ui-disabled"); //disables all suits

	//now renable the ones in the hand
	for(g=0;g<USERHand.length;g++){
		var getcard = USERHand[g].split(" ");
		var totalCount = 0;
		
		$("#newuserhand a."+ getcard[0]).removeClass("ui-disabled");//enable it if disabled
		$("#newuserhand a."+ getcard[0] + " span."+getcard[1].toLowerCase()).removeClass("ui-disabled");//enable the suit

		$("#newuserhand a."+ getcard[0] + " .suits span").each(function() {
			if($(this).hasClass("ui-disabled") || $(this).hasClass("ui-complete")){ //added complete to try to not zero out sets of 4
			}else{
				totalCount++;
				$("#newuserhand a."+ getcard[0] + " .ui-count").text(totalCount);
			}
		});
	}
	var newhand = "";
	for(h=0;h<AIHand.length;h++){ //update Dealer hand
		newhand += "<li class='card ui-shadow'></li>";
	}
	$("#dealerhand").html("<ul class='deck'>"+newhand+"</ul>");//return to display 
}



/*************************GO FISH*******************************/
function goFish(sentcard){//this was card but setting card below?
	isEnd();//is the game over now?
	var label = "";
	if(CurrentTurn == "AI"){ //TELL THE USER THAT THE NEED TO GO FISH
		toastr.info('Go Fish', null, {target: $('.turn span p'),"timeOut": "1000","positionClass": "toast-top-full-width"});
		label = "Gibby";
	}else{
		toastr.error('Go Fish', null, {target: $('.turn span p'),"timeOut": "1000","positionClass": "toast-top-full-width"});
		label = customName;
	}
	
	var Decklength = shuffledDeck.length;
	var card = getRandomInt (0, (Decklength-1));//pick a random card from the deck. 
	window[CurrentTurn + 'Hand'].push(shuffledDeck[card]);//add card to array
	window[CurrentTurn + 'Hand'].sort();
	
	//updateDeck();
	//for now leave in Gibbys finds for debugging
	if(CurrentTurn == "USER"){
		$(".response").append("<li> -- go fish - " + label + " found " + shuffledDeck[card] + "</li>"); //REMOVE LATER - DEBUG 
	}else{
		$(".response").append("<li> -- go fish</li>");
	}
	var checkcard = shuffledDeck[card].split(" ");
	
	removeByIndex(shuffledDeck,card);//remove card from deck
	
	var go = "";
	for(l=0;l<shuffledDeck.length;l++){
		go += '<p>' + shuffledDeck[l] + '</p>';
	}
	
	$(".gofishpiletemp").html(go);
	
	var currentSuit = checkcard[1];
	var thisSuit = "";
	if(currentSuit == "H"){thisSuit = "icon-hearts";}else if(currentSuit == "D"){thisSuit = "icon-diamonds";}else if(currentSuit == "S"){thisSuit = "icon-spades";}else{thisSuit = "icon-clubs";}
	
	if(CurrentTurn == "USER"){
		var direction = '80px';
		var cardAdded = "<div class='innerstack ui-corner-all insidecard'>"+checkcard[0]+"<div class='suits'><span class='"+thisSuit+"'></span></div></div>";
	}else{
		var direction = '-80px';
		var cardAdded = "<div class='stack ui-corner-all insidecard'></div>";
	}
	
	$(".gofishpile").append(cardAdded);
	
	$(".gofishpile .insidecard").animate({ opacity: 1, left:"20%"}, 1000, function() {
		// Animation complete.
		$(".gofishpile .insidecard").animate({ opacity: 0.25, top: direction }, 1000, function() {
		//this was outside of this loop
		$(this).remove(); //remove the animated element
		
		//a card was added from the gofish pile check for 4
		check4four();
		updateDeck();
		
		if(sentcard == checkcard[0]){
			var showpossesive = "";
			var showprounoun = "";
			
			if(CurrentTurn == "AI"){showpossesive = "Gibby";}else{showpossesive = customName;}
			toastr.success(showpossesive + " found the card", null, {target: $('.turn span p'),"timeOut": "1000","positionClass": "toast-top-full-width"});
			
			$(".response").append("<li>"+showpossesive+" found the card!</li>"); //REMOVE LATER - DEBUG INFO
			
			isEnd();//is the game over now?
			
			if(CurrentTurn == "AI"){
				gibbytaketurn();
			}
		}else{
			//check 4 before switch Turn
			//checkArr = new Array();
			//check4four();
			
			switchTurn();//temporary
		}
	});
	});
}

/*************************GIBBYS TURN*******************************/
function goGibby(){
	timeoutID = window.setTimeout(gibbytaketurn, 2000);//slow down Gibby's turn a bit 
}
function gibbytaketurn(){
	
	//add in some AI here - guess a card % chance that the cpu guesses one of the cards that the user asks for 
	var guess = getRandomInt(0, (AIHand.length-1));
	var guessCard = AIHand[guess];
	var guessSuit = guessCard.split(" ");
	//alert(guess + " : " + guessCard + " : " + guessSuit);
	searchCards(CurrentTurn,guessSuit[0]);
	window.clearTimeout(timeoutID);
}

function switchTurn(){//turn switcher
	//check that the decks aren't empty - and that there aren't any moves. 
	isEnd();
	if(CurrentTurn == "USER"){
		CurrentTurn = "AI";
		$("#newuserhand a").addClass("ui-disabled");
	}else{
		CurrentTurn = "USER";
		updateDeck();
	}
	if(CurrentTurn == "AI"){
		goGibby();
	}
}



/*************************PAGE EVENTS*******************************/
//randomize some stuff for the triangle spin
//create some random stuff for the triangle
$( document ).ready(function() {
	//var customName = "You";
	startGame(); //start the game
	$.mobile.document.on( "click", ".popupinfo", function( evt ) {
	   	var myCard = $(this).find(".digit").text().split(" ");
	    $("#popupInfo .cardname").html(myCard[0]);
	    $("#popupInfo a").attr('id',myCard[0]);
	});
	$(".play").click(function(){
		customName = $("#text-name").val();
		if(customName == undefined){ customName = "You";}
		if(customName.length > 8){
			$(".text-name-label").prepend('<p class="error">Error please check that your name is 8 characters or less.</p>');
			return false;
		}else{
			$("#text-name").removeClass('error');
			return true;
		}
	});
	$(".searchfor").click(function() { //user go fish button clicked
		var Searching = $(this).attr('id');
		searchCards(CurrentTurn,Searching);
	});
	$(".reset").click(function() { //user go fish button clicked
		//reset the game
		reset();
	});
	/*$(document).on("pagecontainerhide", function (e, ui) {
	  var next_page = ui.nextPage[0].id;
	  if (next_page == "play") { startGame();}
	});*/
});