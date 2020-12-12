const { Default_Prefix, Color, Support } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "refresh",
  aliases: ["rf"],
  category: "Other",
  description: "Refresh Bot For Better Performance!",
  usage: "refresh",
  run: async (client, message, args) => {
     if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You Don't Have Enough Permission To Use This Command - Administrator`);
    
    const Filter = m => m.author.id == message.author.id;
    
    const Warn = await message.channel.send("Please Respond With Yes Or No To Confirm Refresh!\n\nIt Will Clear Queue But It Will Make Quality Better\n\nTime Limit: 5 Minutes");
    
    await message.channel.awaitMessages(Filter, { max: 1, time: 300000, errors: ["time"] }).then(async Msg => {
        Msg = Msg.content.toLowerCase();
        if (Msg === "no" || Msg !== "no" && Msg !== "yes") return message.channel.send("Okay, Canceled >_<");
        if (message.guild.me.voice) await message.guild.me.voice.kick(message.guild.me.id);
        await client.queue.delete(message.guild.id);
        const Embed = new Discord.MessageEmbed()
        .setColor(C)
    });
  }
};