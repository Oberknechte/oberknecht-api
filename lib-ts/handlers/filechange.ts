import { i } from "..";
import { _log } from "../functions/_log";
import { _stackname } from "../functions/_stackname";
import { _wf } from "../functions/_wf";
import { isdebug } from "../functions/isdebug";
import { getAllObjectKeysTree, getByObjectFromTree } from "oberknecht-utils";

export function filechange(sym: string): void {
    if (isdebug(sym, 2)) _log(0, `${_stackname("oberknecht-api", "handlers", "filechange")[3]} executed`);

    let changed_files = 0;

    let files = i.apiclientData[sym].files;

    async function filechange() {
        for (let file in files) {
            if (files[file].hasChanges && getAllObjectKeysTree(i.apiclientData[sym].paths).includes(file)) {
                delete files[file].hasChanges;
                // @ts-ignore
                _wf(sym, getByObjectFromTree(i.apiclientData[sym].paths, file)[0][0], files[file]);
                changed_files++;
            };
        };
    };

    filechange();

    if (isdebug(sym, 2)) _log(0, `${_stackname("oberknecht-api", "handlers", "filechange")[3]} executed\t(Changed ${changed_files})`);
};