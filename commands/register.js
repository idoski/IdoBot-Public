// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
const { SlashCommandBuilder } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('register for point collection/index addition. Only stores user id.'),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {const player = interaction.user.id;},
};
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
