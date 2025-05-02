"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filechange = void 0;
const __1 = require("..");
const _log_1 = require("../functions/_log");
const _stackname_1 = require("../functions/_stackname");
const _wf_1 = require("../functions/_wf");
const isdebug_1 = require("../functions/isdebug");
const oberknecht_utils_1 = require("oberknecht-utils");
function filechange(sym) {
    if ((0, isdebug_1.isdebug)(sym, 2))
        (0, _log_1._log)(0, `${(0, _stackname_1._stackname)("oberknecht-api", "handlers", "filechange")[3]} executed`);
    let changed_files = 0;
    let files = __1.i.apiclientData[sym].files;
    async function filechange() {
        for (let file in files) {
            if (files[file].hasChanges && (0, oberknecht_utils_1.getAllObjectKeysTree)(__1.i.apiclientData[sym].paths).includes(file)) {
                delete files[file].hasChanges;
                // @ts-ignore
                (0, _wf_1._wf)(sym, (0, oberknecht_utils_1.getByObjectFromTree)(__1.i.apiclientData[sym].paths, file)[0][0], files[file]);
                changed_files++;
            }
            ;
        }
        ;
    }
    ;
    filechange();
    if ((0, isdebug_1.isdebug)(sym, 2))
        (0, _log_1._log)(0, `${(0, _stackname_1._stackname)("oberknecht-api", "handlers", "filechange")[3]} executed\t(Changed ${changed_files})`);
}
exports.filechange = filechange;
;
