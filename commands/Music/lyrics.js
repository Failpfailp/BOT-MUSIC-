const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const Finder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  category: "Music",
  description: "Show Song Lyrics!",
  usage: "Lyrics",
  run: async (client, message, args) => {
    
    const Queue = client.queue.get(message.guild.id);
    
    if (!Queue && !args[0]) return message.channel.send("Please Give Something To Search!");
    
    let Lyric, Lyrics;
    
    try {
      Lyric = await Finder(Queue.Songs[0].Title || args.join(" "), '');
      if (!Lyric) return message.channel.send("No Lyrics Found - " + Queue.Songs[0].Title || args.join(" "));
    } catch (error) {
      return message.channel.send("No Lyrics Found - " + Queue.Songs[0].Title || args.join(" "));
    };
    
    Lyrics = await Lyric.split('').join("\n");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Sucess")
    .setDescription("🎶 Joined The Voice Channel, Use Play Command To Play Music!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Joined The Voice Channel, Use Play Command To Play Music!"));
  }
};