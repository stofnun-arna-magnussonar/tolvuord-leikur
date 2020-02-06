var d2 = [];

var offset = 0;

var fetchData = function() {
	fetch('https://idord.arnastofnun.is/d/api/es/terms/?ordabok=TOLVA&offset='+offset).then((res) => res.json()).then((json) => {
		let d = json.results;

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

		if (d.length > 0) {
			offset += 50;

			fetchData();
		}
	});
}

fetchData();