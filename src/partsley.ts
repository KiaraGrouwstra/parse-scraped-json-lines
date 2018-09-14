import * as R from "ramda";
import { doJL } from ".";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { partsley } from "partsley";

const path = R.map(R.concat("/media/tycho/Drogon/Coding/python/tutorial/"), {
    in: "results/coolblue_prods.jl",
    out: "results/coolblue_extracted.jl",
    parselet: "parselets/coolblue.yml",
});
const parselet = yaml.safeLoad(fs.readFileSync(path.parselet, 'utf8'));

doJL(path,
    // { url: string, _body: string }
    R.pipe(
        R.evolve({
            _body: (html: string) => partsley(html, parselet, { transforms: R }),
        } as {}),
        JSON.stringify,
    )
);
