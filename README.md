# deepmatch

Query deeply-nested JSON objects with XPath

## About

Have you ever wished there was a query language for sifting, filtering, and sorting deeply-nested JSON to find exactly the values you're looking for?

That language already exists, and it's called [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath), and this package provides a way that you can use XPath to query JSON, or JSON-compatible objects in JavaScript.

## How

This process works by joining together a number of different technologies, JSON for the objects we want to query, XML for an intermediate representation of the same information, and DOM to allow us to query that XML representation with XPath. Here's how each step works.

### Step 1: Convert JS objects into MicroXML

You supply a JSON-compatible object from JavaScript - this can be the output of [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse), or it can be any object from JavaScript that includes the following data types: `null`, `string`, `number`, `boolean`, `array`, or `object`.

When fed into the function provided by [object-to-microxml.js](./object-to-microxml.js) the object will be consumed and converted into a [MicroXML](https://dvcs.w3.org/hg/microxml/raw-file/tip/spec/microxml.html) representation of the same value. For example, the string `Hello` might be represented in MicroXML as `['string', {}, ['Hello']]`.

If the objects contain arrays or other objects, the entire structure will be converted into a nested tree structure of MicroXML.

```js
// JS
[1, 2, 3]

// MircoXML
['array', {}, [
  ['number', {}, ['1']],
  ['number', {}, ['2']],
  ['number', {}, ['3']],
]]
```

### Step 2: Convert MicroXML into DOM

Once the original object has been converted into a tree of MicroXML, we can consume this data with the function in [microxml-to-dom.js](./microxml-to-dom.js) and build an XML DOM from what we find. This means that input like `['string', {}, ['demo']]` will be represented in XML as `<string>demo</string>`.

```
// MicroXML
['array', {}, [
  ['number', {}, ['1']],
  ['number', {}, ['2']],
  ['number', {}, ['3']],
]]
```

```xml
<!-- DOM -->
<array>
  <number>1</number>
  <number>2</number>
  <number>3</number>
</array>
```

> We don't make use of attributes at all yet, but there may be opportunities in the future for computing certain attributes for things that XPath can't query, to further enhance XPath's ability to target these elements with all available information we know about the values.

### Step 3: Query DOM with XPath

Once we have DOM representing our original data we can use XPath with the function provided in [index.js](./index.js) to run `document.evaluate()` to match XML elements in our DOM based on different criteria. XPath is more expressive and powerful than CSS selectors, so you will be able to write queries for things like:

- “Find all arrays containing boolean values”
- “Find all objects containing a string that includes the text "example"”
- “Find all objects where the value associated with the 'dob' key is a number less than 1990”

When you write an XPath selector to match values inside the DOM structure representing the original data, `document.evaluate()` will return the matching DOM nodes. Here in this example, lets query for all `<number>` tags with `text()` content that is a `number()` that is greater than (`>`) 1. In XPath we can describe that as: `//number[number(text()) > 1]`

```xml
<!-- DOM -->
<array>
  <number>1</number>
  <number>2</number>
  <number>3</number>
</array>
```

```jsx
// JavaScript
[
  <number>2</number>,
  <number>3</number>
]
```

### Step 4: Convert matching DOM back into JS objects

The final step once we have an array of DOM nodes matching our XPath query, is to use the function provided in [dom-to-object.js](./dom-to-object.js) to convert the DOM nodes back into their original JavaScript objects.

```js
// JavaScript
[2, 3]
```

By using this process of representing JavaScript objects in an intermediate format of XML DOM we are able to combine the expressive power of XPath and put it to work to help us find the `'needle'` in `{very: ['large', ['haystacks']]}`.

## Example

### Filtering objects by the comparison of a number value it contains

Suppose you have some data on a number of users in JSON like this:

```js
const users = [
  {
    user: 'Johnny',
    dob: 1995
  },
  {
    user: 'Ronny',
    dob: 1985
  },
  {
    user: 'Donny',
    dob: 1975
  }
]
```

You want to filter this array to only keep the user objects for users that were born before 1990. This is a perfect use-case for an XPath query.

1. We can start by finding all keys the object that have a text value of `dob`, in XPath that's `//key[. = "dob"]`

2. Next, we want to find the associated value, in XPath that's `/following-sibling::value`

3. Then we want to compare the text value of our value as a number to see if it's less than the number 1990, in XPath that's `[. < 1990]`

4. Finally, we want to return the whole user object containing the matching numbers, so we'll need to find the ancestor object, in XPath that's `/ancestor::object`

Separately, each of these pieces is easy to write and reason with, and the syntax is incredibly terse. All together that gives us an XPath of:
  
```xpath
//key[. = "dob"]/following-sibling::value[. < 1990]/ancestor::object
```

That's quite a mouthful. If you want to break it down further into bite-sized pieces for easier documentation and refactoring later, I would recommend that you put the individual parts of the path into an array as strings, and `join()` them together as one string before you use them:

```js
[
  '//key',
  '[. = "dob"]',
  '/following-sibling::value',
  '[. < 1990]',
  '/ancestor::object'
].join('')
```

When we query our original array using this XPath selector we yield the following result:

```js
[
  {
    user: 'Ronny',
    dob: 1985
  },
  {
    user: 'Donny',
    dob: 1975
  }
]
```

## Bonus Round: CSS Selectors

This repository also contains a function in [css-match.js](./css-match.js) that allows you to query JS object using CSS selectors. Though writing CSS selectors is simpler and more familiar for many people, it lacks most of the descriptive power that makes querying objects with XPath useful in the first place.

This function is provided here mainly as a demonstration of the difference in power between XPath and CSS selectors, but it is usable on its own, and if the information you are looking for can be described in terms of CSS selectors, it may be all you need. For most querying, XPath will give you tools to work with in the form of [functions](https://developer.mozilla.org/en-US/docs/Web/XPath/Functions) and [axes](https://developer.mozilla.org/en-US/docs/Web/XPath/Axes).

```js
import cssMatch from './css-match.js'

console.log(
  cssMatch(['a', 'b', 'c', 'd'], ':last-child')
)

// ['d']
```