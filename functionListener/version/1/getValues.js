const getValues = {

    types: {
        'sub_command': 1,
        'sub_command_group': 2,
        'string': 3,
        'integer': 4,
        'boolean': 5,
        'user': 6,
        'channel': 7,
        'role': 8
    },

    // Create Functions
    createFunctions: function (interaction, bot) {

        // Result
        const result = {};

        // Get Items
        for (const item in getValues.items) {
            result[item] = getValues.items[item](interaction, bot);
        }

        // Send
        return result;

    },

    // Generators
    generators: {

        // Avatar URL
        avatarURL: (userID, hash) => {
            return (imgData = {}) => {

                // Format
                const imageformats = { webp: 'webp', png: 'png', jpg: 'jpg', 'jpeg': 'jpeg', gif: 'gif' };
                if (typeof imgData.format === "string" && typeof imageformats[imgData.format] === "string") {
                    imgData.format = '.' + imgData.format;
                } else {
                    imgData.format = '.webp';
                }

                // Dynamic
                if (typeof imgData.dynamic !== "boolean" || !imgData.dynamic) { imgData.dynamic = false; }
                if (imgData.dynamic) format = imgData.format.startsWith('a_') ? '.gif' : imgData.format;

                // Size
                const sizes = { 16: 16, 32: 32, 64: 64, 128: 128, 256: 256, 512: 512, 1024: 1024, 2048: 2048, 4096: 4096 };

                if (typeof imgData.size === "number" && typeof sizes[imgData.size] === "number") {
                    imgData.size = '?size=' + imgData.size;
                } else {
                    imgData.size = '';
                }

                // Return Data
                return `https://cdn.discordapp.com/avatars/${userID}/${hash}${imgData.format}${imgData.size}`;

            };
        }

    },

    // Functions List
    items: {

        // Author
        author: function (interaction) {
            return function () {

                // Result
                const result = {};

                // Is Member
                if (interaction.member && interaction.member.user) {

                    // Member
                    result.isMember = true;

                    // ID
                    result.id = interaction.member.user.id;

                    // Username
                    result.username = interaction.member.user.username;
                    result.discriminator = interaction.member.user.discriminator;
                    result.tag = result.username + '#' + result.discriminator;

                    // Name
                    if (typeof interaction.member.nick === "string") {
                        result.nick = interaction.member.nick;
                        result.name = interaction.member.nick;
                    } else if (typeof interaction.member.user.username === "string") {
                        result.name = interaction.member.user.username;
                    }

                    // Avatar
                    result.avatar = interaction.member.user.avatar;

                    // More Info
                    result.deaf = interaction.member.deaf;
                    result.joined_at = interaction.member.joined_at;
                    result.mute = interaction.member.mute;
                    result.permissions = interaction.member.permissions;
                    result.roles = interaction.member.roles;
                    result.premium_since = interaction.member.premium_since;
                    result.permissions = interaction.member.permissions;

                    // Public Flags
                    result.public_flags = interaction.member.user.public_flags;

                    // Get Avatar
                    result.avatarURL = getValues.generators.avatarURL(result.id, result.avatar);

                    // Complete
                    return result;

                }

                // Is User
                else if (interaction.user) {

                    // Member
                    result.isMember = false;

                    // ID
                    result.id = interaction.user.id;

                    // Username
                    result.username = interaction.user.username;
                    result.discriminator = interaction.user.discriminator;
                    result.name = interaction.user.username;
                    result.tag = result.username + '#' + result.discriminator;

                    // Avatar
                    result.avatar = interaction.user.avatar;

                    // Public Flags
                    result.public_flags = interaction.user.public_flags;

                    // Get Avatar
                    result.avatarURL = getValues.generators.avatarURL(result.id, result.avatar);

                    // Complete
                    return result;

                }

                // Nope
                else { return null; }

            };
        },

        // User
        user: function (interaction, bot) {
            return function (where, value, forceBot = false) {
                return new Promise((resolve) => {

                    // Result
                    const result = {};

                    // Prepare ID
                    const objType = require('@tinypudding/puddy-lib/get/objType');
                    if (Array.isArray(interaction.data.options)) {
                        result.id = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 6) && (typeof value !== "string" || value === option.value));
                        if (result.id) {

                            // Get ID
                            result.id = result.id.value;

                            // Final Result data
                            const finalResultData = function () {

                                // Username
                                result.username = interaction.data.resolved.users[result.id].username;
                                result.discriminator = interaction.data.resolved.users[result.id].discriminator;
                                result.tag = result.username + '#' + result.discriminator;

                                // Exist Member
                                if (interaction.data.resolved.members && interaction.data.resolved.members[result.id]) {

                                    // Nickname
                                    if (typeof interaction.data.resolved.members[result.id].nick === "string") {
                                        result.nick = interaction.data.resolved.members[result.id].nick;
                                        result.name = interaction.data.resolved.members[result.id].nick;
                                    }

                                    // Nope
                                    else { result.name = interaction.data.resolved.users[result.id].username; }

                                    // More Info
                                    result.deaf = interaction.data.resolved.members[result.id].deaf;
                                    result.joined_at = interaction.data.resolved.members[result.id].joined_at;
                                    result.mute = interaction.data.resolved.members[result.id].mute;
                                    result.permissions = interaction.data.resolved.members[result.id].permissions;
                                    result.roles = interaction.data.resolved.members[result.id].roles;
                                    result.premium_since = interaction.data.resolved.members[result.id].premium_since;
                                    result.permissions = interaction.data.resolved.members[result.id].permissions;

                                }

                                // Nope
                                else { result.name = interaction.data.resolved.users[result.id].username; }

                                // Avatar
                                result.avatar = interaction.data.resolved.users[result.id].avatar;

                                // Public Flags
                                result.public_flags = interaction.data.resolved.users[result.id].public_flags;

                                // Get Avatar
                                result.avatarURL = getValues.generators.avatarURL(result.id, result.avatar);

                                // Complete
                                resolve(result);
                                return;

                            };

                            // Username
                            if (!forceBot && interaction.data.resolved && interaction.data.resolved.users && interaction.data.resolved.users[result.id]) {
                                finalResultData();
                            }

                            // Try Discord Bot
                            else {

                                // Interaction
                                const fixInteractionValues = function (user, member) {

                                    // Fix Values
                                    if (!interaction.data.resolved) { interaction.data.resolved = {}; }
                                    if (!interaction.data.resolved.members) { interaction.data.resolved.members = {}; }
                                    if (!interaction.data.resolved.users) { interaction.data.resolved.users = {}; }
                                    if (!interaction.data.resolved.users[result.id]) { interaction.data.resolved.users[result.id] = {}; }
                                    if (!interaction.data.resolved.members[result.id]) { interaction.data.resolved.members[result.id] = {}; }
                                    if (!interaction.data.discordjs) { interaction.data.discordjs = {}; }
                                    if (!interaction.data.discordjs.members) { interaction.data.discordjs.members = {}; }
                                    if (!interaction.data.discordjs.users) { interaction.data.discordjs.users = {}; }

                                    // Discord JS Values
                                    interaction.data.discordjs.members[result.id] = member;
                                    interaction.data.discordjs.users[result.id] = user;

                                    // Create User
                                    const createUserBase = function () {

                                        // Create User data
                                        interaction.data.resolved.users[result.id].avatar = user.avatar;
                                        interaction.data.resolved.users[result.id].bot = user.bot;
                                        interaction.data.resolved.users[result.id].discriminator = user.discriminator;
                                        interaction.data.resolved.users[result.id].id = result.id;
                                        interaction.data.resolved.users[result.id].username = user.username;

                                        // Flags
                                        if (user.flags && user.flags.bitfield) {
                                            interaction.data.resolved.users[result.id].public_flags = user.flags.bitfield;
                                        } else {
                                            interaction.data.resolved.users[result.id].public_flags = user.flags;
                                        }

                                        // Complete
                                        finalResultData();
                                        return;

                                    };

                                    // Exist Member
                                    if (member) {

                                        // Create User data
                                        interaction.data.resolved.members[result.id].is_pending = false;
                                        interaction.data.resolved.members[result.id].joined_at = member.joinedAt;
                                        interaction.data.resolved.members[result.id].nick = member.nickname;
                                        interaction.data.resolved.members[result.id].pending = false;
                                        interaction.data.resolved.members[result.id].premium_since = member.premiumSince;
                                        interaction.data.resolved.members[result.id].roles = member._roles;

                                        // Mute and Deaf
                                        if (member.voice) {

                                            // Mute
                                            if (member.voice.mute) {
                                                interaction.data.resolved.members[result.id].mute = member.voice.mute;
                                            } else {
                                                interaction.data.resolved.members[result.id].mute = false;
                                            }

                                            // Deaf
                                            if (member.voice.deaf) {
                                                interaction.data.resolved.members[result.id].deaf = member.voice.deaf;
                                            } else {
                                                interaction.data.resolved.members[result.id].deaf = false;
                                            }

                                        }

                                        // Disable All
                                        else {
                                            interaction.data.resolved.members[result.id].mute = false;
                                            interaction.data.resolved.members[result.id].deaf = false;
                                        }

                                        // Flags
                                        if (member.permissions && member.permissions.bitfield) {
                                            interaction.data.resolved.members[result.id].permissions = member.permissions.bitfield;
                                        } else {
                                            interaction.data.resolved.members[result.id].permissions = member.permissions;
                                        }

                                        // Create User Base
                                        createUserBase();

                                    }

                                    // Nope
                                    else { createUserBase(); }

                                    // Complete
                                    return;

                                };

                                // Exist Bot
                                if (objType(bot, 'object')) {

                                    // Member User
                                    if (typeof interaction.guild_id === "string" || (typeof interaction.guild_id === "number")) {
                                        bot.guilds.fetch(interaction.guild_id).then(guild => {
                                            guild.members.fetch(result.id).then(member => {
                                                return fixInteractionValues(member.user, member);
                                            }).catch(err => {
                                                result.err = err;
                                                resolve(result);
                                                return;
                                            });
                                            return;
                                        }).catch(err => {
                                            result.err = err;
                                            resolve(result);
                                            return;
                                        });
                                    }

                                    // Normal User
                                    else {
                                        bot.users.fetch(result.id).then(user => {
                                            return fixInteractionValues(user);
                                        }).catch(err => {
                                            result.err = err;
                                            resolve(result);
                                            return;
                                        });
                                    }

                                }

                                // Nope
                                else {
                                    resolve(null);
                                }

                            }

                        }

                        // Nope
                        else { resolve(false); }

                    }

                    // Nope
                    else { resolve(null); }

                    // Complete
                    return;

                });
            };
        },

        // Channel
        channel: function (interaction, bot) {
            return function (where, value, forceBot = false) {
                return new Promise((resolve) => {

                    // Result
                    const result = {};

                    // Prepare ID
                    const objType = require('@tinypudding/puddy-lib/get/objType');
                    if (Array.isArray(interaction.data.options)) {
                        result.id = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 7) && (typeof value !== "string" || value === option.value));
                        if (result.id) {

                            // Get ID
                            result.id = result.id.value;

                            // Final Result data
                            const finalResultData = function () {

                                // Data
                                result.name = interaction.data.resolved.channels[result.id].name;
                                result.permissions = interaction.data.resolved.channels[result.id].permissions;
                                result.type = interaction.data.resolved.channels[result.id].type;

                                // Types
                                if (typeof result.type === "number") {

                                    // Text
                                    if (result.type === 0) { result.type = 'text'; }

                                    // DM
                                    else if (result.type === 1) { result.type = 'dm'; }

                                    // Voice
                                    else if (result.type === 2) { result.type = 'voice'; }

                                    // Category
                                    else if (result.type === 4) { result.type = 'category'; }

                                    // News
                                    else if (result.type === 5) { result.type = 'news'; }

                                    // Store
                                    else if (result.type === 6) { result.type = 'store'; }

                                    // Group
                                    else if (result.type === 3) { result.type = 'group'; }

                                }

                                // Complete
                                resolve(result);
                                return;

                            };

                            // Username
                            if (!forceBot && interaction.data.resolved && interaction.data.resolved.channels && interaction.data.resolved.channels[result.id]) {
                                finalResultData();
                            }

                            // Try Discord Bot
                            else {

                                // Interaction
                                const fixInteractionValues = function (channel) {

                                    // Fix Values
                                    if (!interaction.data.resolved) { interaction.data.resolved = {}; }
                                    if (!interaction.data.resolved.channels) { interaction.data.resolved.channels = {}; }
                                    if (!interaction.data.resolved.channels[result.id]) { interaction.data.resolved.channels[result.id] = {}; }
                                    if (!interaction.data.discordjs) { interaction.data.discordjs = {}; }
                                    if (!interaction.data.discordjs.channels) { interaction.data.discordjs.channels = {}; }

                                    // Discord JS Values
                                    interaction.data.discordjs.channels[result.id] = channel;

                                    // Insert Values
                                    interaction.data.resolved.channels[result.id].name = channel.name;
                                    interaction.data.resolved.channels[result.id].type = channel.type;
                                    interaction.data.resolved.channels[result.id].id = result.id;

                                    // Complete
                                    finalResultData();
                                    return;

                                };

                                // Exist Bot
                                if (objType(bot, 'object')) {

                                    // Member User
                                    if (typeof interaction.guild_id === "string" || (typeof interaction.guild_id === "number")) {
                                        bot.guilds.fetch(interaction.guild_id).then(guild => {

                                            // Get Fetch
                                            const getFetch = function () {
                                                return bot.channels.fetch(result.id).then(channel => {
                                                    return fixInteractionValues(channel);
                                                }).catch(err => {
                                                    result.err = err;
                                                    resolve(result);
                                                    return;
                                                });
                                            };

                                            // Get Cache
                                            if (guild.channels && guild.channels.cache) {

                                                // Get Channel
                                                const channel = guild.channels.cache.get(result.id);
                                                if (channel) { fixInteractionValues(channel); } else {
                                                    getFetch();
                                                }

                                            }

                                            // Nope
                                            else { getFetch(); }

                                            // Complete
                                            return;

                                        }).catch(err => {
                                            result.err = err;
                                            resolve(result);
                                            return;
                                        });
                                    }

                                    // Normal User
                                    else { resolve(null); }

                                }

                                // Nope
                                else { resolve(null); }

                            }

                        }

                        // Nope
                        else { resolve(false); }

                    }

                    // Nope
                    else { resolve(null); }

                    // Complete
                    return;

                });
            };
        },

        // Role
        role: function (interaction, bot) {
            return function (where, value, forceBot = false) {
                return new Promise((resolve) => {

                    // Result
                    const result = {};

                    // Prepare ID
                    const objType = require('@tinypudding/puddy-lib/get/objType');
                    if (Array.isArray(interaction.data.options)) {
                        result.id = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 8) && (typeof value !== "string" || value === option.value));
                        if (result.id) {

                            // Get ID
                            result.id = result.id.value;

                            // Final Result data
                            const finalResultData = function () {

                                // Data
                                result.color = interaction.data.resolved.roles[result.id].color;
                                result.hoist = interaction.data.resolved.roles[result.id].hoist;
                                result.managed = interaction.data.resolved.roles[result.id].managed;
                                result.mentionable = interaction.data.resolved.roles[result.id].mentionable;
                                result.permissions = interaction.data.resolved.roles[result.id].permissions;
                                result.position = interaction.data.resolved.roles[result.id].position;
                                result.tags = interaction.data.resolved.roles[result.id].tags;
                                result.name = interaction.data.resolved.roles[result.id].name;

                                // Complete
                                resolve(result);
                                return;

                            };

                            // Username
                            if (!forceBot && interaction.data.resolved && interaction.data.resolved.roles && interaction.data.resolved.roles[result.id]) {
                                finalResultData();
                            }

                            // Try Discord Bot
                            else {

                                // Interaction
                                const fixInteractionValues = function (role) {

                                    // Fix Values
                                    if (!interaction.data.resolved) { interaction.data.resolved = {}; }
                                    if (!interaction.data.resolved.roles) { interaction.data.resolved.roles = {}; }
                                    if (!interaction.data.resolved.roles[result.id]) { interaction.data.resolved.roles[result.id] = {}; }
                                    if (!interaction.data.discordjs) { interaction.data.discordjs = {}; }
                                    if (!interaction.data.discordjs.roles) { interaction.data.discordjs.roles = {}; }

                                    // Discord JS Values
                                    interaction.data.discordjs.roles[result.id] = role;

                                    // Data
                                    interaction.data.resolved.roles[result.id].color = role.color;
                                    interaction.data.resolved.roles[result.id].hoist = role.hoist;
                                    interaction.data.resolved.roles[result.id].managed = role.managed;
                                    interaction.data.resolved.roles[result.id].mentionable = role.mentionable;
                                    interaction.data.resolved.roles[result.id].position = role.position;
                                    interaction.data.resolved.roles[result.id].name = role.name;

                                    // Complete
                                    finalResultData();
                                    return;

                                };

                                // Exist Bot
                                if (objType(bot, 'object')) {

                                    // Member User
                                    if (typeof interaction.guild_id === "string" || (typeof interaction.guild_id === "number")) {
                                        bot.guilds.fetch(interaction.guild_id).then(guild => {

                                            guild.roles.fetch(result.id).then(role => {
                                                return fixInteractionValues(role);
                                            }).catch(err => {
                                                result.err = err;
                                                resolve(result);
                                                return;
                                            });
                                            return;

                                        }).catch(err => {
                                            result.err = err;
                                            resolve(result);
                                            return;
                                        });
                                    }

                                    // Normal User
                                    else { resolve(null); }

                                }

                                // Nope
                                else { resolve(null); }

                            }

                        }

                        // Nope
                        else { resolve(false); }

                    }

                    // Nope
                    else { resolve(null); }

                    // Complete
                    return;

                });
            };
        },

        // Boolean
        boolean: function (interaction) {
            return function (where) {

                // Prepare Options
                if (interaction.data.options) {
                    const result = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 5));
                    if (result) {
                        if (typeof result.value === "boolean" && result.value) { return true; } else { return false; }
                    }

                    // Nope
                    else { return null; }

                }

                // Nope
                else { return null; }

            };
        },

        // String
        string: function (interaction) {
            return function (where) {

                // Prepare Options
                if (interaction.data.options) {
                    const result = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 3));
                    if (result) {
                        if (typeof result.value === "string") { return result.value; } else { return null; }
                    }

                    // Nope
                    else { return null; }

                }

                // Nope
                else { return null; }

            };
        },

        // String
        integer: function (interaction) {
            return function (where) {

                // Prepare Options
                if (interaction.data.options) {
                    const result = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 4));
                    if (result) {
                        if (typeof result.value === "number") { return result.value; } else { return null; }
                    }

                    // Nope
                    else { return null; }

                }

                // Nope
                else { return null; }

            };
        },

        subCommand: function (interaction, bot) {
            return function (where) {

                // Prepare Options
                if (interaction.data.options) {

                    // Is String
                    if (typeof where === "string") { where = [where]; }

                    // Is Array
                    if (Array.isArray(where)) {

                        // Search
                        for (const itemOption in where) {
                            if (typeof where[itemOption] === "string") {

                                // Look for
                                const result = interaction.data.options.find(option => option.name === where[itemOption] && (typeof option.type !== "number" || option.type === 1));

                                // Found
                                if (result) {

                                    // Prepare New Item List
                                    if (interaction.data.resolved) { result.resolved = interaction.data.resolved; }
                                    const newGetValues = { get: {}, value: where[itemOption] };
                                    for (const item in getValues.items) {
                                        newGetValues.get[item] = getValues.items[item]({ data: result }, bot);
                                    }

                                    return newGetValues;

                                }

                            }
                        }

                        // Fail
                        return false;

                    }

                    // Nothing
                    else { return null; }

                }

                // Nope
                else { return null; }

            };
        },

        subCommandGroup: function (interaction, bot) {
            return function (where, subCommand, item) {

                // Prepare Options
                if (interaction.data.options) {

                    // Look for
                    const result = interaction.data.options.find(option => option.name === where && (typeof option.type !== "number" || option.type === 2));

                    // Found
                    if (result) {

                        // Look for
                        const nextResult = result.options.find(option => option.name === subCommand && (typeof option.type !== "number" || option.type === 1));

                        // Obj Type
                        const objType = require('@tinypudding/puddy-lib/get/objType');

                        // Exist Item
                        if (objType(item, 'object') || Array.isArray(item)) {

                            // Found
                            if (nextResult) {

                                // Get Value
                                const getValue = function (theItem) {

                                    // Validator
                                    if (typeof theItem.type === "string" && typeof theItem.name === "string") {

                                        // Look for
                                        const type = theItem.type.toLowerCase();
                                        const finalResult = result.options.find(option => option.name === theItem.name && option.type === getValues.types[type]);

                                        // Found
                                        if (finalResult) { return getValues.items[type]({ data: { options: [finalResult] } }, bot)(theItem.name); }

                                        // Nope
                                        else { return null; }

                                    }

                                    // Nope
                                    else { return null; }

                                };

                                // Object
                                if (objType(item, 'object')) {
                                    return getValue(item);
                                }

                                // Array
                                else if (Array.isArray(item)) {

                                    // Prepare Final Result
                                    const finalResult = [];

                                    // Get Values
                                    for (const i in item) {

                                        // Object
                                        if (objType(item, 'object')) {
                                            finalResult.push(getValue(item[i]));
                                        }

                                        // Nope
                                        else {
                                            finalResult.push(null);
                                        }

                                    }

                                    // Complete
                                    return finalResult;

                                }

                                // Nothing
                                else { return null; }

                            }

                            // Nope
                            else { return null; }

                        }

                        // Nope
                        else {

                            // Found
                            if (nextResult) { return true; }

                            // Nope
                            else { return false; }

                        }

                    }

                    // Nope
                    else { return null; }

                }

                // Nope
                else { return null; }

            };
        }

    }

};

module.exports = getValues;