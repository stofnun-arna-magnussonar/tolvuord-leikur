fetch('https://idord.arnastofnun.is/d/api/es/terms/?ordabok=TOLVA&offset=50').then((res) => res.json()).then((json) => { d = json.results })
var d2 = [];
_.each(d, function(item) {
	if (item.words.length == 2) {
		let _item = [];
		_.each(item.words, function(word) {
			_item.push({
				word: word.word,
				lang: word.fklanguage,
				definition: word.definition
            });
        });
		d2.push(_item);
    }
});