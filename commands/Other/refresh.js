const { Default_Prefix, Color, Support } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "refresh",
  aliases: ["rf"],
  category: "Other",
  description: "Refresh Bot For Better Performance!",
  usage: "refresh",
  run: async (client, message, args) => {
     if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You Don't Have E`)
  }
};