reader.service('tarotDeck', ['$log', function($log) {

    this.protoDeck = new Deck;
    this.deck = this.protoDeck.deck;
    // this.shuffledDeck = deck;
    this.deck.activeCard = this.deck[0];

    this.shuffledDeck = function() {
        //deck shuffle logic - implemented using Fisher-Yates shuffle algorithm
        var deckCon = new Deck;
        var deck = deckCon.deck;
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

}]);
