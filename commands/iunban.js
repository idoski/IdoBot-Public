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
        .setName('iunban')
        .setDescription('unbans someone')
		.addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason') .setDescription('reason for unban.') .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	// async execute() is the functionality of the command when ran.
	async execute(interaction) {
        const unbanned = interaction.options.getUser('target');
	},
};