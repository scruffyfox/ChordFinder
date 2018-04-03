const majorScale = [2, 2, 1, 2, 2, 2, 1]
const minorScale = [2, 1, 2, 2, 1, 2, 1]
			//  1    2     3    4     5    6    7     8    9    10    11    12
const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']

const majorChordPatterns = {
	"Major": [1, 3, 5], "Dim 5": [1, 3, [5, "b"]], "Dim": [1, [3, "b"], [5, "b"]], "Sus 2": [1, 2, 5], "Sus 4": [1, 4, 5], "Aug": [1, 3, [5, "#"]],
	"Add 2": [1, 2, 3, 5], "6": [1, 3, 5, 6], "7": [1, 3, 5, [7, "b"]], "Maj 7": [1, 3, 5, 7], "7 Dim 5": [1, 3, [5, "b"], [7, "b"]],
	"7 Sus 4": [1, 4, 5, [7, "b"]], "Add 9": [1, 3, 5, 9],
	"9": [1, 3, 5, [7, "b"], 9], "6/9": [1, 3, 5, 6, 9], "Maj 9": [1, 3, 5, 7, 9], "9 Dim 5": [1, 3, [5, "b"], [7, "b"], 9],
	"9 Aug 5": [1, 3, [5, "#"], [7, "b"], 9], "7 Dim 9": [1, 3, 5, [7, "b"], [9, "b"]], "7 Aug 9": [1, 3, 5, [7, "b"], [9, "#"]]
}

const minorChordPatterns = {
	"Minor": [1, 3, 5], "Dim": [1, 3, [5, "b"]],
	"Min Add 2": [1, 2, 3, 5], "Min Add 4": [1, 3, 4, 5], "Min 7": [1, 3, 5, [7, "b"]], "Min (Maj7)": [1, 3, 5, 7],
	"Min 7 Dim 5": [1, 3, [5, "b"], [7, "b"]], "Dim 7": [1, 3, [5, "b"], [7, "bb"]], "Min Add 9": [1, 3, 5, 9],
	"Min 9": [1, 3, 5, [7, "b"], 9]
}

/**
* Creates a new array with the root note being initial position for 12 positions
*/
function offsetNotesForScale(root)
{
	var rootNum = root;
	if (!Number.isInteger(root))
	{
		rootNum = notes.indexOf(root.toLowerCase()) + 1
	}

	var offsetNotes = []
	for (var counter = 0, index = rootNum; counter < 12; index++, counter++)
	{
		if (index - 1 >= notes.length) index = 1;
		offsetNotes.push(notes[index - 1]);
	}

	return offsetNotes;
}

/**
* Creates the scale from a given scale pattern where t = 2, s = 1
*/
function calculateScale(scalePattern, root)
{
	const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
	var offsetNotes = offsetNotesForScale(root);
	var scale = [];

	var offset = 0;
	for (var index = 0; index < scalePattern.length; index++)
	{
		scale.push(offsetNotes[offset]);
		offset += scalePattern[index];
	}

	// console.log(scale)

	var diff = 0
	for (var index = 0; index < scale.length - 1; index++)
	{
		var currIndex = letters.indexOf(scale[index][0])
		var nextIndex = letters.indexOf(scale[index + 1][0])
		diff = (nextIndex - currIndex)
		if (diff < 0) diff += 7

		if (diff != 1)
		{
			scale[index + 1] = invertNote(scale[index + 1])
		}
	}

	// if scale has more than 7 sharps, convert to inverted flat
	// only f# are valid sharp scales
	var sharpCount = 0;
	scale.forEach(function(note){ sharpCount += note[1] == "#" ? 1 : 0 })

	if (sharpCount >= 7)
	{
		for (var index = 0; index < scale.length; index++)
		{
			scale[index] = invertNote(scale[index])
		}
	}

	return scale;
}

/**
* Flattens a note
*/
function flattenNote(note)
{
	if (note[1] == "b")
	{
		var index = notes.indexOf(note[0]) - 1
		return notes[index]
	}
	else
	{
		var index = notes.indexOf(note) - 1
		return notes[index]
	}
}

/**
* Sharpens a note
*/
function sharpenNote(note)
{
	if (note[1] == "b")
	{
		var index = notes.indexOf(note[0]) + 1
		return notes[index]
	}
	else
	{
		var index = notes.indexOf(note) + 1
		return notes[index]
	}
}

/**
* Converts like notes e.g. Ab == G#
*/
function invertNote(note)
{
	if (note[1] == "#")
	{
		if (note == "b#") return "c"
		if (note == "e#") return "f"

		// double sharp...
		if (note[2] == "#")
		{
			return notes[(notes.indexOf(note[0]) + 2) % 12]
		}

		return notes[(notes.indexOf(note) + 1) % 12] + "b"
	}
	else if (note[1] == "b")
	{
		if (note == "bb") return "a#"
		if (note == "cb") return "b"
		if (note == "fb") return "e"

		return notes[(notes.indexOf(note[0]) - 2) % 12] + "#"
	}
	else
	{
		if (note == "b") return "cb"
		if (note == "c") return "b#"
		if (note == "e") return "fb"
		if (note == "f") return "e#"

		// double sharp x_x
		return notes[(notes.indexOf(note[0]) - 1) % 12] + "#"
	}
}

/**
* Calculates what inversion the given notes are against the provided pattern
* C E G = perfect, E G C = 1st, G C E = 2nd
*/
function calculateInversion(scale, notes, pattern)
{
	if (pattern[0] instanceof Array) return null
	if (notes[0] == scale[pattern[0] - 1]) return 0
	if (invertNote(notes[0]) == scale[pattern[0] - 1]) return 0

	var rootNote = scale[pattern[0] - 1]
	var reversed = notes.slice().reverse()
	var perfectMatch = reversed.indexOf(rootNote);
	var invertedMatch = reversed.indexOf(invertNote(rootNote))

	if (perfectMatch > -1) return perfectMatch + 1
	if (invertedMatch > -1) return invertedMatch + 1
	return -1
}

/**
* Attempts to calculate an array of possible chord matches from given array of notes
*/
function calculateChords(notes)
{
	if (notes.length < 1) return;

	notes = notes.filter(function(item, pos, self)
	{
		return self.indexOf(item) == pos;
	})

	var noteScales = []
	notes.forEach(function(note)
	{
		var maj = calculateScale(majorScale, note)
		noteScales.push({"scale": maj, "patterns": majorChordPatterns, "sig": "Major"})

		var min = calculateScale(minorScale, note)
		noteScales.push({"scale": min, "patterns": minorChordPatterns, "sig": "Minor"})
	})

	// check each scale and rank them based on how many accidental notes, 0 = 100% match
	var scaleMatches = []
	noteScales.forEach(function(noteScale)
	{
		var matchCount = 0
		notes.forEach(function(note)
		{
			// exact matches
			var inc = noteScale.scale.indexOf(note)
			if (inc > -1)
			{
				matchCount += 1
				return
			}

			// flattened note match
			if (note.length > 1)
			{
				inc = noteScale.scale.indexOf(flattenNote(note))
				if (inc > -1)
				{
					matchCount += 1
					return
				}
			}
		})

		noteScale['accidentals'] = notes.length - matchCount
		scaleMatches.push(noteScale)
	})

	scaleMatches = scaleMatches.sort(function(a, b)
	{
		return a.accidentals > b.accidentals
	})

//	console.log(scaleMatches)

	// loop through matched scales and calculate note indexs
	var matched = []
	scaleMatches.forEach(function(noteScale)
	{
		var degrees = []
		notes.forEach(function(note)
		{
			// check if note is in scale directly
			var index = noteScale.scale.indexOf(note)
			if (index > -1)
			{
				degrees.push(index + 1)
			}
			else
			{
				// check for inverted notes
				var inverted = invertNote(note)
				index = noteScale.scale.indexOf(inverted)
				if (index > -1)
				{
					degrees.push(index + 1)
				}
				else
				{
					// check if a note has been sharpened/flattened
					var solo = note[0]
					var soloIndex = noteScale.scale.indexOf(solo)

					var soloInvertedIndex = -1
					var inverted = invertNote(note)
					if (inverted != undefined)
					{
						var soloInverted = inverted[0]
						soloInvertedIndex = noteScale.scale.indexOf(soloInverted)
					}

					var alt = []

					if (soloIndex > -1)
					{
						alt.push([soloIndex + 1, '#'])
					}

					if (soloInvertedIndex > -1)
					{
						alt.push([soloInvertedIndex + 1, inverted[1]])
					}

					if (alt.length > 0)
					{
						degrees.push(alt)
					}
				}
			}
		})

		degrees = degrees.sort()
		// console.log([noteScale.scale, degrees])

		// ignore only partial matches -- for now
		if (degrees.length < notes.length) return

		// loop through chords to find one that matches the indexes
		for (var key in noteScale.patterns)
		{
			var matches = true
			var noteIndex = 0
			noteScale.patterns[key].forEach(function(patternNoteIndex)
			{
				if (!matches) return

				if (patternNoteIndex instanceof Array && degrees[noteIndex] instanceof Array)
				{
					if (!degrees[noteIndex][0] instanceof Array)
					{
						degrees[noteIndex] = [degrees[noteIndex]]
					}

					var anyMatch = false
					degrees[noteIndex].forEach(function(degreeVar)
					{
						if ((degreeVar[0] == patternNoteIndex[0] && degreeVar[1] == patternNoteIndex[1])
						|| (degreeVar[1] == "#" && (degreeVar[0] + 1 == patternNoteIndex[0] && patternNoteIndex[1] == 'b')) // account for indirect matches: sharp 5# == 6b
						|| (degreeVar[1] == "b" && (degreeVar[0] - 1 == patternNoteIndex[0] && patternNoteIndex[1] == '#'))) // account for indirect matches: flat 5b == 4#
						{
							anyMatch = true
							return
						}
					})

					matches = anyMatch
				}
				else
				{
					if (noteIndex > degrees.length || patternNoteIndex != degrees[noteIndex])
					{
						matches = false
						return
					}
				}

				noteIndex++
			})

			if (degrees.length != noteScale.patterns[key].length) continue

			if (matches)
			{
				var scale = ''
				noteScale.scale.push(noteScale.scale[0])
				noteScale.scale.forEach(function(note)
				{
					if (scale.length > 0) scale += ", "
					scale += note[0].toUpperCase()
					if (note[1] != undefined) scale += note[1]
				})

				matched.push({
					"key": noteScale.scale[0][0].toUpperCase() + noteScale.scale[0].substring(1,) + " " + noteScale.sig,
					"scale": scale,
					"pattern": noteScale.patterns[key].join()
						.replace(/,#/g, '#')
						.replace(/,b/g, 'b')
						.replace(/,/g, ', '),
					"chord": noteScale.scale[0][0].toUpperCase() + noteScale.scale[0].substring(1,) + " " + key,
					"inversion": calculateInversion(noteScale.scale, notes, noteScale.patterns[key]) || "root"
				})
			}
		}
	})

	return matched
}
