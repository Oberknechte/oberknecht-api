const oberknechtAPIOptions = {
    debug: Number(),
    token: String(),
    startPath: String() ?? "package path",
    saveIDs: Boolean(),
    // starting at project dir (process.cwd())
    saveIDsPath: String(),
    filechange_interval: Number() ?? 10000,
    // ivr.fi
    use3rdparty: {
        getUsers: Boolean()
    }
};

module.exports = oberknechtAPIOptions;