var functions = {messageCallback: function(notes){}}

function connectMidi(callback)
{
	// request MIDI access
	if (navigator.requestMIDIAccess)
	{
		functions['messageCallback'] = callback
		navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
	}
	else
	{
		alert("No MIDI support in your browser.");
	}
}

var midi, data, downNotes = [];

// midi functions
function onMIDISuccess(midiAccess)
{
	midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

	var inputs = midi.inputs.values();
	// loop over all available inputs and listen for any MIDI input
	for (var input = inputs.next(); input && !input.done; input = inputs.next())
	{
		// each time there is a midi message call the onMIDIMessage function
		input.value.onmidimessage = onMIDIMessage;
	}
}

function onMIDIFailure(e)
{
	console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function onMIDIMessage(message)
{
	data = message.data; // this gives us our [command/channel, note, velocity] data
	var type = data[0] & 0xf0

	if (type == 144) // down
	{
		// 60 = middle C
		downNotes.push({"note": convertToNote(data[1]), "octave": convertToOctave(data[1])})
	}
	else if (type == 128)
	{
		for (var index = downNotes.length - 1; index >= 0; index--)
		{
			if (downNotes[index].note === convertToNote(data[1]) && downNotes[index].octave == convertToOctave(data[1]))
			{
				downNotes.splice(index, 1);
			}
		}
	}

	functions['messageCallback'](downNotes)
}

function convertToNote(noteInt)
{
	const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
	var index = (noteInt - 60) % 12

	if (index < 0) index = index + 12
	index = Math.abs(index)

	return notes[index]
}

function convertToOctave(noteInt)
{
	return (Math.floor(noteInt / 12)) - 5
}
