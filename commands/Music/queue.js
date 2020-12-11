const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  description: "Show Music Queue!",
  usage: "Queue",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Please Join A Voice Channel!");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Nothing Is Playing Right Now, Add Some Songs To Queue :D"
      );
    
    const Sort = await Queue.Songs.map((Song, Position) => {
       if ((Position + 1) === 1) {
         return `Now Playing: ${Song.Title}\n`;
       } else {
         return `${Position - 1} | ${Song.Title.length > 60 ? Song.Title.slice(0, 60) + "..." : Song.Title}`;
       };
    }).join("\n");

    return message.channel.send("```" + Sort + "```", {
      split: { char: "\n" }
    });
  }
};
