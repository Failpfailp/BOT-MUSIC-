const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "filters",
  aliases: ["ft"],
  category: "Music",
  description: "Show Music Filters!",
  usage: "Filters | <Filter Name>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("Please Join A Voice Channel!");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Nothing Is Playing Right Now, Add Some Songs To Queue :D"
      );
    
    const Filters = ["8d", "nightcore", "bassboost", "vaporwave", "phaser", "tremolo", "vibrato", "treble", "normalizer", "surrounding", "pulsator", "subboost", "karaoke", "flanger", "haas", "gate", "mcompand"];
    const One = [];
    
    for (let Filter in Filters) {
      let Status = await Queue.Filters[Filter] ? "Disabled - ❌" : "Enabled - ✅";
      await One.push(`${Filter.charAt(0).toUpperCase() + Filter.slice(1)} - ${Status}`);
    };
    
    if (!args[0]) return message.channel.send(One.join("\n"), { split: { char: "\n" }});
    
    if (!Filters.find(Fil => Fil === args[0].toLowerCase())) return message.channel.send(`No Filter Found - ` + args[0].charAt(0).toUpperCase() + args[0].slice(1) || "");
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color)
    .setTitle("Filter Information")
    .addField("Name", Filters[args[0]])
  }
};
