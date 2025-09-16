// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable indent */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination-v2');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows what commands do!'),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
        const i = 1;
    },
};