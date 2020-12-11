module.exports = {
  GetRegxp: async function(Type) {
    if (!Type || typeof Type !== "string") return null;

    if (Type === "YtID") {
      return /^[a-zA-Z0-9-_]{11}$/;
    } else if (Type === "YtUrl") {
      return /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    } else if (Type === "YtPlID") {
      return /(PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41}/;
    } else {
      return /https?:\/\/(www.)?youtube.com\/playlist\?list=((PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41})/;
    }
  },
  Linker: async function(Type) {
    if (Type.toLowerCase() === "Base") {
      return "https://youtube.com/watch?v=";
    } else {
      return `https://youtube.com/watch?v=${Type}`;
    }
  },
  UpdateStream: async function(message, client, Filter, ytdl) {
    const Queue = await client.queue.get(message.guild.id);

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

    const EcoderFilters = [];
    Object.keys(Queue.Filters).forEach(FilterName => {
      if (Queue.Filters[FilterName]) {
        EcoderFilters.push(Filters[FilterName]);
      };
    });
    let Encoder;
    if (EcoderFilters.length < 1) {
      Encoder = [];
    } else {
      Encoder = ["-af", EcoderFilters.join(",")];
    };
    
    const Old = Queue.Bot.dispatcher.streamTime;

    const Stream = ytdl(Queue.Songs[0].Link, {
      filter: "audioonly",
      opusEncoded: true,
      Encoder,
      seek: Queue.Bot.dispatcher.streamTime / 1000,
      highWaterMark: 1 << 30
    });
    
    setTimeout(async () => {
      if (Queue.Bot) Queue.Bot.dispatcher.destroy();
      Queue.Bot.dispatcher = Stream;
      Queue.Bot.play(Stream, {
        type: "opus",
        bitrate: "auto"
      }).on("finish", async () => {
          const Shift = await Queue.Songs.shift();
          if (Queue.Loop === true) {
            await Queue.Songs.push(Shift);
          }
          //await Player(Queue.Songs[0]);
        })
        .on("error", async error => {
          await console.log(error);
          return message.channel.send(
            "Error: Something Went Wrong From Bot Inside"
          );
        });
      
      Queue.Bot.dispatcher.streamTime += Old;
      
      await Queue.Bot.dispatcher.setVolumeLogarithmic(Queue.Volume / 100);
      
    }, 1000);
  },
  Objector: async function(Song, message) {
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
    async function FC(Count) {
      if (Count.length === 4) {
        return `${Count[0]}k`;
      } else if (Count.length === 5) {
        return `${Count[0]}${Count[1]}k`;
      } else if (Count.length === 6) {
        return `${Count[0]}${Count[1]}${Count[2]}k`;
      } else if (Count.length === 7) {
        return `${Count[0]}m`;
      } else if (Count.length === 8) {
        return `${Count[0]}${Count[1]}m`;
      } else if (Count.length === 9) {
        return `${Count[0]}${Count[1]}${Count[2]}m`;
      } else if (Count.length === 10) {
        return `${Count[0]}b`;
      } else if (Count.length === 11) {
        return `${Count[0]}${Count[1]}b`;
      } else if (Count.length === 12) {
        return `${Count[0]}${Count[1]}${Count[2]}b`;
      } else if (Count.length === 13) {
        return `${Count[0]}t`;
      } else {
        return Count;
      }
    }
    ("");
    return {
      ID: Song.videoId,
      Title: Song.title,
      Link: Song.video_url,
      Duration: await FD(Song.lengthSeconds),
      Seconds: Song.lengthSeconds,
      Thumbnail: Song.thumbnail.thumbnails[0].url,
      Author: Song.ownerChannelName,
      AuthorLink: Song.ownerProfileUrl,
      Upload: Song.uploadDate,
      Views: await FC(Song.viewCount || 0),
      Age: Song.age_restricted ? "Yes" : "No",
      Owner: message.author.username
    };
  }
};
