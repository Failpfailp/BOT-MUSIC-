const { Default_Prefix, Color, Owner, Donate } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "invite",
  aliases: ["invitelink"],
  category: "Other",
  description: "Give You My Invite Link, Etc!",
  usage: "Invite",
  run: async (client, message, args) => {
    
    const Invite = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`, Owner = `<@${Owner}>`, Dev = `Legendary Emoji#1742`;
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .addField("Invite Me", `[Click Me](Invite)`, true)
    .addField("Owner", Owner, true)
    .addField("Developer", Dev, true)
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("Invite Link - " + Invite));
  }
};