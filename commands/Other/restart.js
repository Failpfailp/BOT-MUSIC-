const { Default_Prefix, Token, Color, Support, Owner } = require("../../config.js");
const Discord = require("discord.js");
const db = require("wio.db");

module.exports = {
  name: "restart",
  aliases: ["rs"],
  category: "Other",
  description: "Restart The Bot!",
  usage: "Restart",
  run: async (client, message, args) => {
     if (parseInt(Owner) !== message.author.id) return message.channel.send("You Don't Have Permission To Use This Command - Bot Owner");
    
    await client.destroy();
    
    setTimeout(async () => {
      await client.login(Token).catch(() => console.log(`Invalid Token Is Provided - Please Give Valid Token!`));
      try {
        return message.channel.send(`Bot Has Been Restarted Successfully - Music Quality Maybe Bad Because Of Restart`);
      } catch (error) {
        return console.log(`Bot Has Been Restarted Successfully - Music Quality Maybe Bad Because Of Restart`);
      }
    }, 1000);
  }
};