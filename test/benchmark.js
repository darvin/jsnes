/*
JSNES, based on Jamie Sanders' vNES
Copyright (C) 2010 Ben Firshman

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Runs 100 frames of Concentration Room
var croomBenchmark = (function() {

    return function() {
        var i;
        var nes = new JSNES({
            emulateSound: true,
            ui: JSNES.DummyUI
        });

        nes.loadRom(getTestRom("croom"));
        nes.setLimitFrames(false);
        nes.isRunning = true;

        for (i=0; i<5; i++) {
            nes.frame();
        }

        // Hit enter on start screen to start scrolling
        nes.keyboard.keyDown({keyCode: 13});
        nes.frame();
        nes.keyboard.keyUp({keyCode: 13});

        for (i=0; i<94; i++) {
            nes.frame();
        }
    };
})();
