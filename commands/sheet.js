// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('sheet')
		.setDescription('Google Sheet link or converts to csv with pass!')
		.addStringOption(option => option.setName('password') .setDescription('Enter password')),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const pass = interaction.options.getString('password') ?? 'bruh';
	},
};
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */