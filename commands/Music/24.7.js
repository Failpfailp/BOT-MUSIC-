const { Default_Prefix, Color } = require("../../config.js");
const { Player } = require("../../Functions.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core"), db = require("wio.db");

module.exports = {
  name: "24.7",
  aliases: ["24:7", "24/7"],
  category: "Music",
  description: "Enable Or Disable 24/7!",
  usage: "24.7",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("You Don't Have Enough Permission To Use This Command - Manage Channels");
    
    let Oned = await db.fetch(`24_${message.guild.id}`);

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setTitle("Success")
      .setDescription(`🎶 24/7 Has Been ${Oned ? "Disabled" : "Enabled"}`)
      .setTimestamp();
    
    await db.set(`24_${message.guild.id}`, )

    return message.channel.send(Embed).catch(() => message.channel.send(`🎶 24/7 Has Been ${Oned ? "Disabled" : "Enabled"}`));
    
  }
};
