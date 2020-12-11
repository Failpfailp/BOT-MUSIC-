const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "jump",
  aliases: [],
  category: "Music",
  description: "Jump To Your Best Song!",
  usage: "Jump <Number Or Title>",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Please Join A Voice Channel!");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Nothing Is Playing Right Now, Add Some Songs To Queue :D");
    
    const Content = args.join(" ");
    
    if (isNaN(Content)) {
      const Song = await Queue.Songs.find()
    }
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription("🎶 Joined The Voice Channel, Use Play Command To Play Music!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Joined The Voice Channel, Use Play Command To Play Music!"));
  }
};