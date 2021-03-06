module.exports = async function (req, res, logger, tinyCfg) {

    // Get DB
    if (typeof req.query[tinyCfg.varNames.bot] === "string") {

        // Debug
        if (tinyCfg.debug) { await logger.log('Reading Bot String: ' + req.query[tinyCfg.varNames.bot]); }

        // Complete Action
        const finalResult = require('./validator/send');
        await finalResult(req, res, logger, tinyCfg, require('./validator/checker')(req, res, logger, tinyCfg));

    }

    // Nope
    else {
        tinyCfg.errorCallback(req, res, 401, 'Invalid Bot Data!');
    }

    // Complete
    return;

};