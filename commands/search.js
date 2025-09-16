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
		.setName('search')
		.setDescription('search the index for a specific card')
		.addStringOption(option => option.setName('cardcode') .setDescription('Type code if searching for specific card.') .setRequired(true)),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const ccode = interaction.options.getString('cardcode') ?? 'null';
	},
};