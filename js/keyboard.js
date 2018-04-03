var functions = {messageCallback: function(notes){}}
var downNotes = []

function connectKeyboard(callback)
{
	functions['messageCallback'] = callback
	window.onkeydown = function(e)
	{
		var key = e.keyCode ? e.keyCode : e.which;
		if (key < 65 || key > 90) return

		// dont add if already added
		var exists = downNotes.filter(k => k.key == String.fromCharCode(key).toLowerCase())
		if (exists.length > 0) return

		downNotes.push({"key": String.fromCharCode(key).toLowerCase(), "octave": 1})
		functions['messageCallback'](downNotes)
	}

	window.onkeyup = function(e)
	{
		var key = e.keyCode ? e.keyCode : e.which;
		if (key < 65 || key > 90) return

		for (var index = downNotes.length - 1; index >= 0; index--)
		{
			if (downNotes[index].key === String.fromCharCode(key).toLowerCase())
			{
				downNotes.splice(index, 1);
			}
		}

		functions['messageCallback'](downNotes)
	}
}
