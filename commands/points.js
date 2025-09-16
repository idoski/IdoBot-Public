// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable indent */
const { SlashCommandBuilder } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('find points of specific player')
		.addUserOption(option => option.setName('target').setDescription('The user').setRequired(true)),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const player = interaction.options.getUser('target');
	},
};