const { Default_Prefix, Color } = require("../../config.js");
const { Player } = require("../../Functions.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core"), db = require("wio.db");

module.exports = {
  name: "8d",
  aliases: [],
  category: "Music",
  description: "Enable Or Disable 8D!",
  usage: "8D",
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
      .setDescription(`🎶 8D Has Been ${Queue.Filters["8d"] ? "Disabled" : "Enabled"}`)
      .setTimestamp();
    
    Queue.Filters["8d"] = Queue.Filters["8d"] ? false : true;
    
    console.log(Queue.Filters)
    
    await Player(message, Discord, client, Ytdl, { Filter: true, Play: Queue.Songs[0], Color: Color, db: db });

    return message.channel.send(Embed).catch(() => message.channel.send(`🎶 8D Has Been ${Queue.Filters["8d"] ? "Disabled" : "Enabled"}`));
    
  }
};
