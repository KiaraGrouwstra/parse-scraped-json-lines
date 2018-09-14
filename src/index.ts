import * as fs from "fs";
import * as readline from "readline";
import * as R from "ramda";
const log = console.log.bind(console);

export function doJL(path: { in: string, out: string }, fn: (v: {}) => string) {
    const fd = fs.openSync(path.out, 'w');
    const rl = readline.createInterface({
        input: fs.createReadStream(path.in),
    });

    const doLine = R.pipe(
        JSON.parse,
        // R.tap(log),
        fn,
        // R.tap(R.pipe((s: string) => JSON.stringify(s, null, ' '), log)),
        // R.tap(log),
        // JSON.stringify,
        (s: string) => fs.writeSync(fd, s+'\n'),
    );

    rl.on('line',
        doLine
        // R.pipe(doLine, rl.close)
    );
}
