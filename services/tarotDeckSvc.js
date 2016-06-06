reader.service('tarotDeck', function() {

    //new instance of deck for card index, regular order
    this.regularDeck = new Deck;
    this.deck = this.regularDeck.deck;

    //init active card
    this.deck.activeCard = this.deck[0];

    //constructor for a new instance of a shuffled deck
    //deck shuffle logic - implemented using Fisher-Yates shuffle algorithm
    this.shuffledDeck = function() {

        var deckForShuffle = new Deck;
        var deck = deckForShuffle.deck;
        var m = deck.length,
            t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = deck[m];
            deck[m] = deck[i];
            deck[i] = t;
        }
        return deck;
    }
});