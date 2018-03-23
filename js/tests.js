$(function()
{
	runTests();
})

function runTests()
{
	testFlatten()
	// testSharpen()
	testInvertNote()
	testInversion()
}

function testInvertNote()
{
	assertEqual(invertNote('c'), 'b#')
	assertEqual(invertNote('c#'), 'db')
	assertEqual(invertNote('e'), 'fb')
	assertEqual(invertNote('fb'), 'e')
	assertEqual(invertNote('f'), 'e#')
	assertEqual(invertNote('f#'), 'gb')
	assertEqual(invertNote('g#'), 'ab')
	assertEqual(invertNote('ab'), 'g#')
	assertEqual(invertNote('a#'), 'bb')
	assertEqual(invertNote('b#'), 'c')
	assertEqual(invertNote('cb'), 'b')
}

function testInversion()
{
	var result = calculateInversion(['eb', 'f', 'g', 'ab', 'bb', 'c', 'd'], ['d#', 'g', 'a#'], [1, 3, 5])
	assertEqual(result, 0)
	result = calculateInversion(['eb', 'f', 'g', 'ab', 'bb', 'c', 'd'], ['g', 'a#', 'd#'], [1, 3, 5])
	assertEqual(result, 1)
	result = calculateInversion(['eb', 'f', 'g', 'ab', 'bb', 'c', 'd'], ['a#', 'd#', 'g'], [1, 3, 5])
	assertEqual(result, 2)
}

function testFlatten()
{
	var result = flattenNote("b")
	assertEqual(result, "a#")

	result = flattenNote("a#")
	assertEqual(result, "a")

	result = flattenNote("f")
	assertEqual(result, "e")
}

function testSharpen()
{
	var result = sharpenNote("b")
	assertEqual(result, "c")

	result = sharpenNote("c")
	assertEqual(result, "c#")

	result = sharpenNote("c#")
	assertEqual(result, "d")
}

function assertEqual(a, b)
{
	if (a != b)
	{
		console.log("Assert fail, " + a + " did not match " + b)
	}
}
