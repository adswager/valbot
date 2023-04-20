
const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');


const client = new Discord.Client();
s
const prefix = '!';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();


  if (command === 'search') {

    if (!args.length) {
      return message.reply('Please provide a Valorant nickname!');
    }

    const nickname = args.join(' ');


    message.channel.send(`Searching for ${nickname}...`);

    try {
      // Use axios to fetch the HTML for the player's page on tracker.gg/valorant
      const response = await axios.get(`https://tracker.gg/valorant/profile/riot/${encodeURIComponent(nickname)}/overview`);

      const $ = cheerio.load(response.data);
      const playerName = $('.header > .header__name').text();
      const playerRank = $('.valorant-rank-icon > .valorant-rank-icon__icon').attr('alt');
      const playerRankIcon = $('.valorant-rank-icon > .valorant-rank-icon__icon > img').attr('src');
      const playerMatchesPlayed = $('.matches > .matches__played').text();
      const playerWinRate = $('.matches > .matches__winrate').text();

      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${playerName}'s Stats`)
        .setDescription(`Rank: ${playerRank}\nMatches Played: ${playerMatchesPlayed}\nWin Rate: ${playerWinRate}`)
        .setThumbnail(playerRankIcon);

      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      message.channel.send(`Error: Could not find stats for ${nickname}.`);
    }
  }
});

// Log in to Discord with your client token
client.login('your-token-goes-here');
