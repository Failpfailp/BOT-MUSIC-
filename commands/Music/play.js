const { Default_Prefix, Color } = require("../../config.js");
const { GetRegxp, Linker, Objector } = require("../../Functions.js");
const Discord = require("discord.js");
const Sr = require("youtube-sr");
const syt = require("scrape-yt");
const Ytdl = require("discord-ytdl-core");
const Filters = {
  bassboost: "bass=g=20,dynaudnorm=f=200",
  "8D": "apulsator=hz=0.08",
  vaporwave: "aresample=48000,asetrate=48000*0.8",
  nightcore: "aresample=48000,asetrate=48000*1.25",
  phaser: "aphaser=in_gain=0.4",
  tremolo: "tremolo",
  vibrato: "vibrato=f=6.5",
  reverse: "areverse",
  treble: "treble=g=5",
  normalizer: "dynaudnorm=f=200",
  surrounding: "surround",
  pulsator: "apulsator=hz=1",
  subboost: "asubboost",
  karaoke: "stereotools=mlev=0.03",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  mcompand: "mcompand"
};

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  description: "Play Music With Link Or Playlist Or Query!",
  usage: "Play <Song Name | Song Link | Playlist Link>",
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;
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
        return message.channel.send("Error: No Video Found (ID)!");
      }
    } else if (YtUrl.test(args[0]) && !args[0].toLowerCase().includes("list")) {
      try {
        const Info = await Ytdl.getInfo(args[0]);
        SongInfo = Info.videoDetails;
        Song = await Objector(SongInfo, message);
      } catch (error) {
        console.log(error);
        return message.channel.send(
          "Error: Something Went Wrong Or No Video Found (Link)!"
        );
      }
    } else if (
      YtPlID.test(args[0]) &&
      !args[0].toLowerCase().startsWith("http")
    ) {
      try {
        const Info = await syt.getPlaylist(args[0]);
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.videos[0].id}`
        );
        SongInfo = YtInfo.videoDetails;
        Song = await Objector(SongInfo, message);
        const Arr = [];
        for (const Video of Info.videos) {
          const Infor = await Ytdl.getInfo(
            `https://www.youtube.com/watch?v=${Video.id}`
          );
          const Detail = Infor.videoDetails;
          await Arr.push(await Objector(Detail, message));
        }
        Playlist = {
          Yes: true,
          Data: Arr
        };
      } catch (error) {
        console.log(error);
        return message.channel.send(
          "Error: Something Went Wrong Or No Playlist Found Or Playlist Videos Are Private Or No Videos (ID)!"
        );
      }
    } else if (YtPlUrl.test(args[0])) {
      try {
        const Splitter = await args[0].split("list=")[1];
        const Info = await syt.getPlaylist(
          Splitter.endsWith("/") ? Splitter.slice(0, -1) : Splitter
        );
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.videos[0].id}`
        );
        SongInfo = YtInfo.videoDetails;
        Song = await Objector(SongInfo, message);
        const Arr = [];
        for (const Video of Info.videos) {
          const Infor = await Ytdl.getInfo(
            `https://www.youtube.com/watch?v=${Video.id}`
          );
          const Detail = Infor.videoDetails;
          await Arr.push(await Objector(Detail, message));
        }
        Playlist = {
          Yes: true,
          Data: Arr
        };
      } catch (error) {
        console.log(error);
        return message.channel.send(
          "Error: Something Went Wrong Or No Playlist Found Or Playlist Videos Are Private Or No Videos (Url)!"
        );
      }
    } else {
      try {
        const Info = await Sr.searchOne(args.join(" "));
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.id}`
        );
        SongInfo = YtInfo.videoDetails;
        Song = await Objector(SongInfo, message);
      } catch (error) {
        console.log(error);
        return message.channel.send(
          "Error: Something Went Wrong Or No Video Found (Query)"
        );
      }
    }

    let Joined;
    try {
      Joined = await Channel.join();
    } catch (error) {
      console.log(error);
      return message.channel.send("Error: I Can't Join The Voice Channel!");
    }

    if (ServerQueue) {
      if (Playlist && Playlist.Yes) {
        const Embed = new Discord.MessageEmbed()
          .setColor(Color)
          .setTitle("Playlist Added!")
          .setThumbnail(Playlist.Data[0].Thumbnail)
          .setDescription(
            `[Playlist](${
              args[0].includes("http")
                ? args[0]
                : `https://www.youtube.com/playlist?list=${args[0]}`
            }) Has Been Added To Queue!`
          )
          .setTimestamp();
        await Playlist.Data.forEach(async Video => {
          try {
            await ServerQueue.Songs.push(Video);
          } catch (error) {
            await Channel.leave().catch(() => {});
            return message.channel.send(
              "Error: Something Went Wrong From Bot Inside!"
            );
          }
        });
        return message.channel
          .send(Embed)
          .catch(() =>
            message.channel.send("Playlist Has Been Added To Queue!")
          );
      } else {
        const Embed = new Discord.MessageEmbed()
          .setColor(Color)
          .setTitle("Song Added!")
          .setThumbnail(Song.Thumbnail)
          .setDescription(
            `[${Song.Title}](${Song.Link}) Has Been Added To Queue!`
          )
          .setTimestamp();
        await ServerQueue.Songs.push(Song);
        return message.channel
          .send(Embed)
          .catch(() => message.channel.send("Song Has Been Added To Queue!"));
      }
    }

    const Database = {
      TextChannel: message.channel,
      VoiceChannel: Channel,
      Steam: null,
      Bot: Joined,
      Songs: [],
      Filters: {},
      Volume: 100,
      Loop: false,
      Playing: true
    };

    await client.queue.set(message.guild.id, Database);

    if (Playlist && Playlist.Yes) {
      await Playlist.Data.forEach(ele => Database.Songs.push(ele));
    } else {
      await Database.Songs.push(Song);
    };

    const Player = async Play => {
      const Db = await client.queue.get(message.guild.id);

      if (!Play) {
        await Db.VoiceChannel.leave();
        await client.queue.delete();
        const Embeded = new Discord.MessageEmbed()
          .setColor(Color)
          .setTitle("Queue Ended!")
          .setDescription(
            "Server Queue Has Been Ended, Thanks For Listening To Me <3"
          )
          .setTimestamp();
        return message.channel
          .send(Embeded)
          .catch(() =>
            message.channel.send(
              "Server Queue Has Been Ended, Thanks For Listening To Me <3"
            )
          );
      }

      Db.Bot.on("disconnect", async () => {
        await client.queue.delete(message.guild.id);
      });

      const EcoderFilters = [];
      Object.keys(Db.Filters).forEach(FilterName => {
        if (Db.Filters[FilterName]) {
          EcoderFilters.push(Filters[FilterName]);
        }
      });
      let Encoder;
      if (EcoderFilters.length < 1) {
        Encoder = [];
      } else {
        Encoder = ["-af", EcoderFilters.join(",")];
      };

      const Dispatcher = await Db.Bot.play(
        await Ytdl(String(Play.Link), {
          filter: "audioonly",
          opusEncoded: true,
          quality: "highestaudio",
          Encoder,
          highWaterMark: 1 << 30
        }),
        {
          type: "opus"
        }
      )
        .on("finish", async () => {
          const Shift = await Db.Songs.shift();
          if (Db.Loop === true) {
            await Db.Songs.push(Shift);
          }
          await Player(Db.Songs[0]);
        })
        .on("error", async error => {
          await console.log(error);
          return message.channel.send(
            "Error: Something Went Wrong From Bot Inside"
          );
        });

      await Dispatcher.setVolumeLogarithmic(Db.Volume / 100);

      const PlayEmbed = new Discord.MessageEmbed()
        .setColor(Color)
        .setThumbnail(Play.Thumbnail)
        .setTitle("Now Playing!")
        .setDescription(`🎶 Now Playing: **${Play.Title}**`)
        .setTimestamp();

      await Db.TextChannel.send(PlayEmbed).catch(() =>
        message.channel.send(`🎶 Now Playing: **${Play.Title}**`)
      );
    };

    try {
      await Player(Database.Songs[0]);
    } catch (error) {
      console.log(error);
      await client.queue.delete(message.guild.id);
      await Channel.leave().catch(() => {});
      return message.channel.send(
        "Error: Something Went Wrong From Bot Inside"
      );
    }
  }
};
