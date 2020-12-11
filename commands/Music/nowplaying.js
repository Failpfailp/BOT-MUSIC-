const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");

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

    if (!Queue)
      return message.channel.send(
        "Nothing Is Playing Right Now, Add Some Songs To Queue :D"
      );

    const Song = await Queue.Songs[0],
      Total = Song.Duration,
      Seconds = Song.Seconds,
      Time = Queue.Bot.dispatcher.streamTime;

    const Sec = Math.round(Time / 1000);
    const Remaining = await FD((Seconds - Sec).toFixed(0));
    const Adder = await FD(Sec);
    const Index = Math.round((Time / Seconds) * 15);
    const Bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
    let ShowBar;

    if (Index >= 1 && Index <= 15) {
      ShowBar = Bar.splice(Index, 0, "🔵");
    } else {
      ShowBar = "🔵▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    }

    function FD(duration) {
      let minutes = Math.floor(duration / 60);
      let hours = "";
      if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
      }
      duration = Math.floor(duration % 60);
      duration = duration >= 10 ? duration : "0" + duration;
      if (hours != "") {
        return hours + ":" + minutes + ":" + duration;
      }
      return minutes + ":" + duration;
    }

    const Data = `Song - **[${Song.Title}](${Song.Link})**\nCreator - **[${
      Song.Author
    }](${Song.AuthorLink})**\nUpload - **${
      Song.Upload
    }**\nViews - **${Song.Views ||
      0}**\nDuration - **${Total}**\nRemaining - **${Remaining}**\n`;

    const Embed = new Discord.MessageEmbed()
      .setColor(Color)
      .setThumbnail(Song.Thumbnail)
      .setTitle("Now Playing!")
      .setDescription(Data + ShowBar)
      .setFooter(`Added By ${Song.Owner}`)
      .setTimestamp();

    console.log(message.channel.send(Embed));
  }
};
