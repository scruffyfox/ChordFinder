$(function() {
	var selected = []
	var blackKeys = [1, 3, 6, 8, 10]
	var keys = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']

	function pianoClick(event)
	{
		$(event.target).toggleClass('active')

		selected = []
		$('.active').each(function(e, i)
		{
			selected.push($(this).attr('data-key'))
			var chordSpec = calculateChords(selected)

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
	}

	function buildPiano()
	{
		$('#piano').append('<ul></ul>')

		for (iteration = -2; iteration < 2; iteration++)
		{
			keys.forEach(function(key, index)
			{
				$('#piano ul').append("<li class='" + (blackKeys.indexOf(index) > -1 ? 'black' : 'white') + "'"
					+ " data-key='" + key + "'"
					+ " data-octave='" + iteration + "'"
					+ " data-note='" + (index + 1) + "'"
					+ ">"
					// + key + iteration
					+ "</li>")
			})
		}

		$('#piano ul li').click(pianoClick)
	}

	buildPiano();
});
