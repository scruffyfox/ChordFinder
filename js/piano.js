var PIANO = {
	selected: [],
	playing: [],
	blackKeys: [1, 3, 6, 8, 10],
	keys: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],

	piano: new Tone.Sampler({
		'A0' : 'A0.[mp3|ogg]',
		'C1' : 'C1.[mp3|ogg]',
		'D#1' : 'Ds1.[mp3|ogg]',
		'F#1' : 'Fs1.[mp3|ogg]',
		'A1' : 'A1.[mp3|ogg]',
		'C2' : 'C2.[mp3|ogg]',
		'D#2' : 'Ds2.[mp3|ogg]',
		'F#2' : 'Fs2.[mp3|ogg]',
		'A2' : 'A2.[mp3|ogg]',
		'C3' : 'C3.[mp3|ogg]',
		'D#3' : 'Ds3.[mp3|ogg]',
		'F#3' : 'Fs3.[mp3|ogg]',
		'A3' : 'A3.[mp3|ogg]',
		'C4' : 'C4.[mp3|ogg]',
		'D#4' : 'Ds4.[mp3|ogg]',
		'F#4' : 'Fs4.[mp3|ogg]',
		'A4' : 'A4.[mp3|ogg]',
		'C5' : 'C5.[mp3|ogg]',
		'D#5' : 'Ds5.[mp3|ogg]',
		'F#5' : 'Fs5.[mp3|ogg]',
		'A5' : 'A5.[mp3|ogg]',
		'C6' : 'C6.[mp3|ogg]',
		'D#6' : 'Ds6.[mp3|ogg]',
		'F#6' : 'Fs6.[mp3|ogg]',
		'A6' : 'A6.[mp3|ogg]',
		'C7' : 'C7.[mp3|ogg]',
		'D#7' : 'Ds7.[mp3|ogg]',
		'F#7' : 'Fs7.[mp3|ogg]',
		'A7' : 'A7.[mp3|ogg]',
		'C8' : 'C8.[mp3|ogg]'
	}, {
		'release' : 1,
		'baseUrl' : 'samples/'
	}).toMaster(),

	pianoRelease: function(event)
	{
		$(event).removeClass('active')
		var note = $(event).attr('data-key') + (parseInt($(event).attr('data-octave')) + 3);

		PIANO.piano.triggerRelease(note);

		if (PIANO.playing.indexOf(note) > -1)
		{
			PIANO.playing.splice(PIANO.playing.indexOf(note), 1)
		}

		PIANO.calculate()
	},

	pianoClick: function(event)
	{
		$(event).toggleClass('active')
		var note = $(event).attr('data-key') + (parseInt($(event).attr('data-octave')) + 3);

		if ($(event).hasClass('active'))
		{
			if (PIANO.playing.indexOf(note) < 0)
			{
				PIANO.playing.push(note)
				PIANO.piano.triggerAttack(note);
			}

			// console.log(PIANO.playing)
		}
		else
		{
			PIANO.pianoRelease(event)
		}

		PIANO.calculate()
	},

	calculate: function()
	{
		PIANO.selected = []
		$('.active').each(function(e, i)
		{
			PIANO.selected.push($(this).attr('data-key'))
			var chordSpec = calculateChords(PIANO.selected)

			var table = "<table><tr><th id='key'>Key</th><th id='scale'>Scale</th><th id='pattern'>Pattern</th><th id='chord'>Chord</th><th id='inversion'>Inversion</th></tr>";

			$('#results').html(table)

			chordSpec.forEach(function(obj)
			{
				var row = "<tr>";
				for (var property in obj)
				{
					row += "<td>" + obj[property] + "</td>";
				}

				row += "</tr>";

				$('#results table').append(row)
			});
		});
	},

	buildPiano: function()
	{
		$('#piano').append('<ul></ul>')

		for (iteration = -2; iteration < 2; iteration++)
		{
			PIANO.keys.forEach(function(key, index)
			{
				$('#piano ul').append("<li class='" + (PIANO.blackKeys.indexOf(index) > -1 ? 'black' : 'white') + "'"
					+ " data-key='" + key + "'"
					+ " data-octave='" + iteration + "'"
					+ " data-note='" + (index + 1) + "'"
					+ ">"
					// + key + iteration
					+ "</li>")
			})
		}

		$('#piano ul li').click(function(e)
		{
			PIANO.pianoClick($(e.target))
		})
	}
};

$(function()
{
	PIANO.buildPiano();
});
