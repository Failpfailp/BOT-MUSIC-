const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  category: "Music",
  description: "Show Music Information!",
  usage: "Nowplaying",
  run: async (client, message, args) => {
    
    const Channel = message.member.voice.channel;
    
    if (!Channel) return message.channel.send("Please Join A Voice Channel!");
    
    const Queue = await client.queue.get(message.guild.id);
    
    if (!Queue) return message.channel.send("Nothing Is Playing Right Now, Add Some Songs To Queue :D");
    
    const Song = await Queue.Songs[0];
    
    const Data = `Song - **[${Song.Title}](${Song.Link})**\nCreator - **[${Song.Author}](${Song.AuthorLink})**\nUpload - **${Song.Upload}**\nViews - **${Song.Views || 0}**\nAge Restricted - **${Song.Age}**\nDuration - **${Song.Duration}**\nAdded - **${Song.Owner}**`;
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Now Playing!")
    .setDescription(Data)
    .setFooter(`Requested By ${message.author.username}`)
    .setTimestamp();
    
    console.log(Data);
    
    console.log(message.channel.send("lol"));
    
    return message.channnel.send("lol").catch(() => message.channel.send(`Song - **${Song.Title}**\nCreator - **${Song.Author}**\nDuration - **${Song.Duration}**`))
  }
};