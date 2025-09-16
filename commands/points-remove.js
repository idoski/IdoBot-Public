// IdoBotV2...
// imports SlashCommandBuilder for creating a new command
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
/* eslint-disable indent */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// module.exports makes the command readable by other files in the bot project.
module.exports = {
	// data provides command definition
	data: new SlashCommandBuilder()
		.setName('points-remove')
		.setDescription('deduct points')
		.addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName('points') .setDescription('Points to remove') .setRequired(true) .setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
		const player = interaction.options.getUser('target');
        const pToRemove = interaction.options.getInteger('points');
	},
};