const axios = require("axios");
const request = require("request");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "bold",
    aliases: [],
    version: "1.0",
    author: "zach",
    countDown: 40,
    role: 2,
    shortDescription: "get a random video from API",
    longDescription: "",
    category: "randomvideo",
    guide: "{pn}",
  },
  onStart: async function ({ api, event }) {
    try {
      api.sendMessage("Your video is loading...!", event.threadID);
      const response = await axios.get("https://redroomapi-s-e98g.onrender.com/bold");
      const videoData = response.data.data;
      const videoURL = videoData.url;
      const videoID = videoData.id;

      const videoFilePath = path.join(__dirname, "cache", "video.mp4");
      const file = fs.createWriteStream(videoFilePath);
      const rqs = request(encodeURI(videoURL));
      console.log("Video Downloaded >>> " + videoID);

      rqs.pipe(file);

      file.on("finish", () => {
        api.sendMessage(
          {
            attachment: fs.createReadStream(videoFilePath),
          },
          event.threadID,
          event.messageID
        );
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the video.", event.threadID);
    }
  },
};
