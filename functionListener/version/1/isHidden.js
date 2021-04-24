module.exports = (data, interaction, getItem, tinyCfg) => {

    // Hidden Checker
    const hiddenChecker = (item, getItem) => {
        if (
            (typeof item.description === "string" && item.description.indexOf(tinyCfg.hiddenDetector.icon) > -1) ||
            getItem.boolean(tinyCfg.hiddenDetector.value)
        ) { return true; } else { return false; }
    };

    const tryMoreHidden = (options) => {
        for (const item in options) {
            if (!isHidden) { isHidden = hiddenChecker(options[item].options, getValues.createFunctions({ data: options[item] }, tinyCfg.bot)); } else { return true; }
        }
        return false;
    };

    // The Value
    let isHidden = false;

    // Base
    isHidden = hiddenChecker(interaction.data, getItem);
    if (!isHidden && interaction.data.options) {
        isHidden = tryMoreHidden(interaction.data.options);
    }

    // Is Hidden
    if (isHidden) {
        if (typeof data === "string") { data = { content: data, flags: 64 }; } else {
            data.data.flags = 64;
        }
    }

    // Complete
    return data;

};