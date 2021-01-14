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

The chapter gives examples of minimal code for declaring functions.  Note that Typescript is a little more verbose (but safer).

In the review examples for Chapter 01 examples, we showed generics.
The set of review examples in
 [`src/chapter02/greetings.test.ts`](https://github.com/SHaTRO/mostly-adequate/tree/main/src/chapter02/greetings.test.ts)
 demonstrate simple usage as well as higher order (similar to the `httpGet` example in the book).
They also introduce currying, though that is not yet introduced in the book.
