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
  Objector: async function(Song, message) {
    async function FD(Duration) {
      const Dete = new Date(0);
        Dete.setSeconds(Duration);
        let IsoString;
        try {
        IsoString = await Dete.toISOString().substr(11, 8);
        } catch (error) {
            return "?:?:?";
        };
        let Split = IsoString.split(":");
        if (Split[0] === "00") Split = Split.slice(1);
        if (Split[0].startsWith("0")) Split[0] = Split[0][1];
        if (isNaN(Split[0].toLowerCase())) return "?:?:?";

        return Split.join(":");
    };
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
        } else if (Count.length === 8) {
            return `${Count[0]}${Count[1]}${Count[2]}m`;
        } else if (Count.length === 9) {
          return `${Count[0]}b`;
        } else if (Count.length === 10) {
          return `${Count[0]}${Count[1]}b`
        } else if (Count.length === 11) {
          return `${Count[0]}${Count[1]}${Count[2]}b`;
        } else if (Count.length === 12) {
          return `${Count[0]}t`;
        } else {
            return Count;
        };
    }
    return {
      ID: Song.VideoId,
      Title: Song.title,
      Link: Song.video_url,
      Duration: FD(Song.Duration),
      Thumbnail: Song.thumbnail.thumbnails[0].url,
      Author: Song.ownerChannelName,
      AuthorLink: Song.ownerProfileUrl,
      Upload: Song.uploadDate,
      Views: FC(Song.viewCount || 0),
      Age: Song.age_restricted ? "Yes" : "No",
      Owner: message.author.username
    };
  }
};
