const { Default_Prefix, Color } = require("../../config.js");
const { Player } = require("../../config.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")

module.exports = {
  name: "nightcore",
  aliases: [],
  category: "Music",
  description: "Enable Or Disable Nightcore!",
  usage: "Nightcore",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Please Join A Voice Channel!");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Nothing Is Playing Right Now, Add Some Songs To Queue :D"
      );

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setTitle("Scuess")
      .setDescription(`🎶 Nightcore Has Been ${Queue.Filters["nightcore"] ? "Enabled" : "Disabled"}`)
      .setTimestamp();
    
    Queue.Filters["nightcore"] = true;

    message.channel.send(Embed).catch(() => message.channel.send(`🎶 Nightcore Has Been ${Queue.Filters["nightcore"] ? "Enabled" : "Disabled"}`));
    
    await Player(message, Discord, client, Ytdl, { Filter: { nightcore: true } })
  }
};
