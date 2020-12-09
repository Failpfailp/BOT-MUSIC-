module.exports = {
      GetRegxp: async function (Type) {
        if (!Type || typeof Type !== "string") return null;

        if (Type === "YtID") {
            return /^[a-zA-Z0-9-_]{11}$/;
        } else if (Type === "YtUrl") {
            return /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        } else if (Type === "YtPlID") {
            return /(PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41}/;
        } else {
            return /https?:\/\/(www.)?youtube.com\/playlist\?list=((PL|UU|LL|RD)[a-zA-Z0-9-_]{16,41})/;
        };
    },
    Linker: async function (Type) {
      if (Type.toLowerCase() === "Base") {
        return "https://youtube.com/watch?v=";
      } else {
        return `https://youtube.com/watch?v=${Type}`;
      };
    }
}