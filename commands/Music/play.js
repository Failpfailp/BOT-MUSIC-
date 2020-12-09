const { Default_Prefix, Color } = require("../../config.js");
const { GetRegxp, Linker, Objector } = require("../../Functions.js");
const Discord = require("discord.js");
const Sr = require("youtube-sr");
const Ytpl = require("ytpl");
const Ytdl = require("discord-ytdl-core");

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  description: "Play Music With Link Or Playlist Or Query!",
  usage: "Play <Song Name | Song Link | Playlist Link>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    if (!Channel)
      return message.channel.send("Please Join A Voice Channel To Play Music!");
    if (!args[0])
      return message.channel.send(
        "Please Give Any Of The Following :\nYoutube Video (Link - ID) , Youtube Playlist (Link - ID) , Query"
      );
    if (
      !Channel.permissionsFor(message.guild.me).has("CONNECT") ||
      !Channel.permissionsFor(message.guild.me).has("SPEAK")
    )
      return message.channel.send(
        "I Don't Have Enough Permissions To Play Music - Connect , Speak"
      );

    const YtID = await GetRegxp("YtID"),
      YtUrl = await GetRegxp("YtUrl"),
      YtPlID = await GetRegxp("YtPlID"),
      YtPlUrl = await GetRegxp("YtPlUrl"),
          Base = await Linker("Base");
    let Song = null,
      SongInfo = null,
      Playlist = null;
    const ServerQueue = await client.queue.get(message.guild.id);
    
    if (YtID.test(args[0])) {
        try {
            const Link = await Linker(args[0]);
            const Info = await Ytdl.getInfo(Link);
            SongInfo = Info.videoDetails;
            Song = await Objector(SongInfo, message);
        } catch (error) {
            console.log(error);
            return message.channel.send(`Error: No Video Found (ID)!`);
        };
    } else if (YtUrl.test(args[0]) && !args[0].toLowerCase().includes("list")) {
        try {
            const Info = await Ytdl.getInfo(args[0]);
            SongInfo = Info.videoDetails;
            Song = await Objector(SongInfo, message);
        } catch (error) {
            console.log(error);
            return message.channel.send(`Error: Something Went Wrong Or No Video Found (Link)!`);
        };
    } else if (YtPlID.test(args[0]) && !args[0].toLowerCase().startsWith("http")) {
        try {
            const Info = await Ytpl(args[0]);
            const YtInfo = await Ytdl.getInfo(Info.items[0].url_simple);
            SongInfo = YtInfo.videoDetails;
            Song = await Objector(SongInfo, message);
            Playlist = {
                Yes: true,
                Data: Info.items
            };
        } catch (error) {
            console.log(error);
            return message.channel.send(`Error: Something Went Wrong Or No Playlist Found Or Playlist Videos Are Private Or No Videos (ID)!`);
        };
    } else if (YtPlUrl.test(args[0])) {
        try {
            const Info = await Ytpl(args[0]);
            const YtInfo = await Ytdl.getInfo(Info.items[0].url_simple);
            SongInfo = YtInfo.videoDetails;
            Song = await Objector(SongInfo, message);
            Playlist = {
                Yes: true,
                Data: Info.items
            };
        } catch (error) {
            console.log(error);
            return message.channel.send(`Error: Something Went Wrong Or No Playlist Found Or Playlist Videos Are Private Or No Videos (Url)!`);
        };
    } else {
        try {
            const Info = await Sr.searchOne(args.join(" "));
            const YtInfo = await Ytdl.getInfo(`https://www.youtube.com/watch?v=${Info.id}`);
            SongInfo = await 
            Song = await Objector(SongInfo, message);
        } catch (error) {
            console.log(error);
            return message.channel.send(`Error: Something Went Wrong Or No Video Found (Query)`);
        };
    };

    let Joined;
    try {
        Joined = await Channel.join();
    } catch (error) {
        console.log(error);
        return message.channel.send(`Error: I Can't Join The Voice Channel!`);
    };
  }
};
