const Discord = require('discord.js');
const { status } = require('minecraft-server-util');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const commands = require('./commands');

const { token, applicationID, serverID, serverIP, serverPort, channelID } = config;

const client = new Discord.Client();
const rest = new REST({ version: '9' }).setToken(token);

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationGuildCommands(applicationID, serverID),
      { body: commands.map(command => command.toJSON()) }
    );

    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'serverstatus') {
    const response = await status(serverIP, { port: serverPort }).catch(
      (error) => {
        console.error(error);
        interaction.reply('Failed to fetch server status.');
      }
    );

    if (response) {
      const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Server Status')
        .addField('Server IP', serverIP)
        .addField('Server Port', serverPort)
        .addField('Version', response.version)
        .addField('Players', `${response.onlinePlayers}/${response.maxPlayers}`)
        .setFooter('Made with 💖 by @xafeltix | This embed is updated every 30 seconds')
        .setTimestamp();

      if (response.samplePlayers) {
        const playerNames = response.samplePlayers.map((player) => player.name);
        embed.addField('Player Names', playerNames.join('\n'));
      }

      const channel = await interaction.client.channels.fetch(channelID);
      if (channel && channel.isText()) {
        channel.send({ embeds: [embed] });
      } else {
        console.error(`Invalid channel ID: ${channelID}`);
      }
    }
  } else if (commandName === 'ip') {
    const embed = new Discord.MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Server IP and Port')
      .addField('IP', serverIP)
      .addField('Port', serverPort)
      .addField('Version', '1.19x')
      .setFooter('Made with 💖 by @xafeltix')
      .setTimestamp();

    const channel = await interaction.client.channels.fetch(channelID);
    if (channel && channel.isText()) {
      channel.send({ embeds: [embed] });
    } else {
      console.error(`Invalid channel ID: ${channelID}`);
    }
  }
});

client.login(token);
