const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = [
  new SlashCommandBuilder()
    .setName('serverstatus')
    .setDescription('Check The Minecraft Server Status'),
  new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Get The Server IP and Port')
];
