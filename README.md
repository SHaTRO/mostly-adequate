# Mostly Adequate - Gitbook Review

## Source Material

[Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/content/)

## Overview

Examples are generally provided as one or more libraries of functions.
An accompanying set of one or more test files is provided to demonstrate their use in practice.

## Chapters

### Chapter 01 - Introduction

This chapter includes a *Brief Encounter* with the first examples.
These examples demonstrate mathematical properties of functions.

Review examples are in
 [`src/chapter01`](https://github.com/SHaTRO/mostly-adequate/tree/main/src/chapter01).
The math property assertions are demonstrated by examples in the
 [`mathstuff.test.ts`](https://github.com/SHaTRO/mostly-adequate/tree/main/src/chapter01/mathstuff.test.ts)
 file.
Note that the *commutative* property is not *associative*.

### Chapter 02 - First Class Functions

This chapter gives examples of minimal code for declaring functions.  Note that Typescript is a little more verbose (but safer).

In the review examples for Chapter 01 examples, generics were used because this is Typescript.
The set of review examples in
 [`src/chapter02/greetings.test.ts`](https://github.com/SHaTRO/mostly-adequate/tree/main/src/chapter02/greetings.test.ts)
 demonstrate simple usage as well as higher order (similar to the `httpGet` example in the book).
They also introduce currying, though that is not yet introduced in the book.

### Chapter 03 - Purity and Memoization

This chapter discusses the nature of and reasoning for pure functions.
While overly derisive of other forms of programming, it does elucidate the benefits of functional programming.

In the review, rather than implementing `memoize()` an imported implementation from the NPM module `fast-memoize` is used.
This allows demonstration of referential transparency.

In order to handle BigInt serialization and avoid exceptions, the BigInt.prototype is modified to support toJSON() as string.
Note that this modification does NOT support deserializing strings back to BigInt - that would have to be done by codec, transformer, or manually.

### Chapter 04 - Currying

This chapter explores the idea of currying and partial application of functions, with concrete examples.  

Also note the introduction of the term *variadic* with regards to functions.
A *variadic* function is a function of *indefinite* arity, essentially with a variable number of arguments.

Because this review is in Typescript, the `curry()` function from the essential library will not be used.
In lieu of `curry()`, declare curried functions verbosely and fully apply them as `fn(x)(y)` rather than `fn(x, y)`.

### Chapter 05 - Composition

This chapter explores functional composition.
The examples in the chapter refer to an essential function, `compose()`, which is a right-to-left composition function that takes functions as arguments.

In the review, the `compose()` function is replaced with `flow()` function from **fp-ts** which is a left-to-right composition function (thankfully).
It is necessary to also use the `pipe()` function from **fp-ts** to avoid type conflicts when composing with `flow()` in some cases.

### Chapter 06 - Principled Refactor

This chapter demonstrates an example application, including concepts of declarative coding and principle refactoring.

Browserify is used to support a one page browser app for this chapter.
The code for this chapter is located in *browser/chapter06* instead of *src/chapter06*.
The html, which should be opened directly in a browser and references the build app file, is locaed in *browser/chapter06/html*.

To run the browser application:
1) Compile the application code using one of: 
    * `npm run build:chapter06` - post-refactor version most likely
    * `npm run build:chapter06:pre-refactor` - the pre-refactor version
    * `npm run build:chapter06:post-refactor` - the post-refactor version
2) Open the file located at *browser/chapter06/html/index.html* in the browser.

The example code in the chapter is written as a single file in Javascript.
Here are some of the changes made to build the app in Typescript:
* As usual, **fp-ts** is used insted of **ramda**.
* **Browserify** is used to build the app as a single file.
* A new *tsconfig-browser.json* file is used for this build, and a build command is added to *package.json*.
* **fetch** is used instead of the JQuery XHR functions, leveraging Webworker functionality.
* URL fetching utilities are moved to their own file, *lib/fetchJson.ts* to unclutter the application code.
* The shared **Impure** methods are moved to *lib/impure.ts* for shared use by the app versions.
* Instead of the `prop` function, **Lens** optics from **monacle-ts** is used.
* All of the "functions" used to build the app itself are moved to *functions/* in their respective files.
* We did jump ahead a little and add `Either<E,A>` when doing the fetch to handle errors.

Both the pre-refactor and post-refactor apps are essentially identical, but are importing different:% versions of `url` and `render`.

### Chapter 07 - Hindley-Milner & Assoc.

This chapter explores Hindley-Milner type signatures and free theorems. 
It also makes a passing mention of type constraints. 
The primary thrust of the chapter is that reasoning about functions via type signature and naming can be better than "RTFMing".
The argument is compelling if not wholly demonstrated.

For the review, the Hindly-Milner type signatures are represented alongside typescript functional declarations.
This demonstrates the power of Typescript to enforce strong typing while retaining the flexibility of the functional programming.

Note that no examples of "constraints" are presented.
Javascript, lacking type signatures, does not support an example of this directly.
This is a future topic to explore.

### Chapter 08 - Tupperware

This chapter explores containers, Functors, error handling, and asynchronous tasks.

For the review, we vary somewhat from items presented in order to explore their equivalents in fp-ts.
Some of the constructs used are not the most elegant but they are effective.
Because "error handling" is covered in this chapter, we do draft many of our exercises such that we defer error state until the end.

### Chapter 09 - Monadic Onions

This chapter explores the associativity of functions on Monads, specifically map and join.

For the review we do a little bit with Maybe, but we use Lens (monocle-ts) instead of "safeProp" and derive our own properties functions.
We also use O.Option instead of Maybe, and update from using `join` to using `flatten` as per *fp-ts* and maintaining the monadic nature.

Excercises are left as exactly that.