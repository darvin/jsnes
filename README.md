[![Build Status](https://travis-ci.org/darvin/jsnes.png)](https://travis-ci.org/darvin/jsnes)

JSNES
=====

A JavaScript NES emulator.

Build
-----

To build a distribution, you will need NodeJS, npm, grunt

    $ npm install -g grunt-cli
    $ npm install

Then run:

    $ grunt

This will create ``jsnes.min.js`` and ``jsnes.src.js`` in ``dist/``.


Tests
-----

For performing tests, run:

    $ grunt test


Benchmark
---------

The benchmark in ``test/benchmark.js`` is intended for testing JavaScript 
engines. It does not depend on a DOM or Canvas element etc.
