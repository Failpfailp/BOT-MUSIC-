const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "removesong",
  aliases: ["rs"],
  category: "Music",
  description: "Remove A Song From Queue!",
  usage: "Removesong <Title Or Number [From Queue]>",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Please Join A Voice Channel!");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Nothing Is Playing Right Now, Add Some Songs To Queue :D");
   
    if (Queue.Songs.length === 1) return message.channel.send("🎶 Only 1 Song In Queue :(");
    
    let Content = args.join(" "), Song;
    
    Song = await Queue.Songs.find(Son => Son.Title.toLowerCase().includes(Content.toLowerCase()));
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription("🎶 Song Has Been Removed!")
    .setTimestamp();
    
    if (Song) {
      const Index = await Queue.Songs.indexOf(Song), Title = await Queue.Songs[0].Title;
      await Queue.Songs.splice(Index, 1);
      if (Queue.Songs[0].Title !== Title) Queue.Bot.dispatcher.end();
      return message.channel.send(Embed).catch(() => message.channel.send("🎶 Song Has Been Removed!"));
    } else {
      const Title = await Queue.Songs[0].Title;
      Song = await Queue.Songs[parseInt(args[0])];
      if (!Song) return message.channel.send("No Song Found!");
      await Queue.Songs.splice(parseInt(args[0]), 1);
      if (Queue.Songs[0].Title !== Title) Queue.Bot.dispatcher.end();
      return message.channel.send(Embed).catch(() => message.channel.send("🎶 Song Has Been Removed!"))
    };
  }
};