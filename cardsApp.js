function showParticipants() {
  var participants = gapi.hangout.getParticipants();

  var retVal = '<p>Participants: </p><ul>';

  for (var index in participants) {
    var participant = participants[index];

    if (!participant.person) {
      retVal += '<li>A participant not running this app</li>';
    }
    retVal += '<li>' + participant.person.displayName + '</li>';
  }

  retVal += '</ul>';

  var div = document.getElementById('participantsDiv');

  div.innerHTML = retVal;
}

/* 

  Returns an array representing a standard 52 card deck. 
*/
function buildDeck52() {
  var suits = {
    HEARTS : "Hearts",
    DIAMONDS: "Diamonds",
    SPADES : "Spades",
    CLUBS : "Clubs"
  }

  deck = Array();
  var cardNum = 0
  for (var num = 1; num <= 13; num++) {
    deck[cardNum++] = {number: num, suit: suits.HEARTS}
    deck[cardNum++] = {number: num, suit: suits.DIAMONDS}
    deck[cardNum++] = {number: num, suit: suits.SPADES}
    deck[cardNum++] = {number: num, suit: suits.CLUBS}
  }
  return deck;
}

/*
Modifies the deck that is passed into it. 

For each spot in the deck, pick a random number between 
(0, size of deck) and swap cards with what's in that random spot
*/  
function shuffle(deck) {

  for (var i = 0; i < deck.length; i++) {
    new_i = Math.round(Math.random() * deck.length);
    tmp = deck[new_i];
    deck[new_i] = deck[i];
    deck[i] = tmp;
  }
}

var onStateChange = function(eventObj) {
  for (var i = 0; i < eventObj.addedKeys.length; ++i) {
    alert(eventObj.addedKeys[i].key + " : " + 
        eventObj.addedKeys[i].value + ", " + 
        eventObj.addedKeys[i].timestamp);
  }
  //for (var j = 0; j < eventObj.removedKeys.length; ++j) {
  //  bar(eventObj.removedKeys[j]);
  //}
  state_ = eventObj.state;
  metadata_ = eventObj.metadata;
};

gapi.hangout.data.onStateChanged.add(onStateChange);


function init() {
  // When API is ready...                                                         
  gapi.hangout.onApiReady.add(
      function(eventObj) {
        if (eventObj.isApiReady) {
          document.getElementById('showParticipants')
            .style.visibility = 'visible';
        }


        deck = buildDeck52();
        shuffle(deck);

        deck_str = JSON.stringify(deck);
        gapi.hangout.data.submitDelta( {"deck": deck_str} );
      });
}