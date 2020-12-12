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
    
    Song = await Queue.Songs.find(Son => Son.Title.includes(Content));
    
    if (Song) {
      const Index = await Queue.Songs.indexOf(Song);
      await Queue.Songs.splice(Index - 1, 1);
      return 
    } else {
      Song = await Queue.Songs[parseInt(args[0])];
      if (!Song) return message.channel.send("No Song Found!");
      await Queue.Songs.splice(parseInt(args[0] - 1), 1);
      return message.channel.send(Embed).catch(() => message.channel.send())
    }
    
    if (!Song) {
      try {
        Song = await Queue.Songs[parseInt(args[0] - 1)];
        if (!Song) return message.channel.send("No Song Found!");
      } catch (error) {
        return message.channel.send("No Song Found!");
      };
    };
    
    Queue.Playing = false;
    Queue.Bot.dispatcher.pause();
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Success")
    .setDescription("🎶 Music Has Been Paused!")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 Music Has Been Paused!"));
  }
};