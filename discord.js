const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
const prefix = "!";
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    console.log(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    if (command === "search") {
        if (!args.length) {
            message.channel.send({ content: "asdklhjagsd" });
            return;
        }
        const nickname = args.join(" ");
        message.channel.send(`Searching for ${nickname}...`);
        try {
            // Use axios to fetch the HTML for the player's page on tracker.gg/valorant
            const response = await axios_1.default.get(`https://tracker.gg/valorant/profile/riot/${encodeURIComponent(nickname)}/overview`);
            const $ = (0, cheerio_1.load)(response.data);
            const playerName = $(".header > .header__name").text();
            const playerRank = $(".valorant-rank-icon > .valorant-rank-icon__icon").attr("alt");
            const playerRankIcon = $(".valorant-rank-icon > .valorant-rank-icon__icon > img").attr("src");
            if (!playerRankIcon)
                return console.error("");
            const playerMatchesPlayed = $(".matches > .matches__played").text();
            const playerWinRate = $(".matches > .matches__winrate").text();
            const embed = new discord_js_1.EmbedBuilder()
                .setColor("#0099ff")
                .setTitle(`${playerName}'s Stats`)
                .setDescription(`Rank: ${playerRank}\nMatches Played: ${playerMatchesPlayed}\nWin Rate: ${playerWinRate}`)
                .setThumbnail(playerRankIcon);
            message.channel.send({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            message.channel.send(`Error: Could not find stats for ${nickname}.`);
        }
    }
    if (command === "shop") {
        message.channel.send("Loading shop...");
        try {
            const response = await axios_1.default.get("https://valorant-api.com/v1/store");
            const skins = response.data.data.featuredSkins.concat(response.data.data.skins);
            const skinStrings = skins.map((skin) => `${skin.displayName} (${skin.cost} VP)`);
            const skinMessage = skinStrings.join("\n");
            message.channel.send(`Available skins in the shop:\n${skinMessage}`);
        }
        catch (error) {
            console.error(error);
            message.channel.send("Error: Could not load shop.");
        }
    }
});
client.login("token");