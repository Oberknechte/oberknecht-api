require("./lib/endpoints/_validatetoken");
require("./lib/endpoints/ban");
require("./lib/endpoints/deleteMessage");
require("./lib/endpoints/getUsers");
require("./lib/endpoints/_getUsers");
require("./lib/endpoints/shoutout");
require("./lib/endpoints/timeout");
require("./lib/endpoints/unban");
require("./lib/endpoints/whisper");
require("./lib/endpoints/announce");
require("./lib/endpoints/updateChatSettings");

require("./lib/endpoints/getChatSettings");
require("./lib/endpoints/getStreams");
require("./lib/endpoints/mod");
require("./lib/endpoints/unmod");
require("./lib/endpoints/vip");
require("./lib/endpoints/unvip");
require("./lib/endpoints/updateColor");
require("./lib/endpoints/getColor");
require("./lib/endpoints/raid");
require("./lib/endpoints/getChannelFollowers");

require("./lib/arguments/chatSettings");
require("./lib/arguments/oberknechtAPIOptions");
require("./lib/arguments/getStreamsFilters");

require("oberknecht-utils");

const oberknechtAPI = require("./lib/api/oberknecht.api");

module.exports = class {
    static oberknechtAPI = oberknechtAPI;
};