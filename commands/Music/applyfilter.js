const { Default_Prefix, Color } = require("../../config.js");
const { Player } = require("../../Functions.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")

module.exports = {
  name: "applyfilter",
  aliases: ["af"],
  category: "Music",
  description: "Enable Or Disable An Filter!",
  usage: "Applyfilter <Filter>",
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
      .setTitle("Success")
      .setDescription(`🎶 Nightcore Has Been ${Queue.Filters["nightcore"] ? "Disabled" : "Enabled"}`)
      .setTimestamp();
    
    Queue.Filters["nightcore"] = Queue.Filters["nightcore"] ? false : true;
    
    await Player(message, Discord, client, Ytdl, { Filter: "nightcore", Play: Queue.Songs[0], Color: Color });

    return message.channel.send(Embed).catch(() => message.channel.send(`🎶 Nightcore Has Been ${Queue.Filters["nightcore"] ? "Disabled" : "Enabled"}`));
    
  }
};
