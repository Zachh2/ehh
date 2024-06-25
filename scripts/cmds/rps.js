module.exports = {
  config: {
    name: "rps",
    version: "1.0",
    author: "Loid",
    countDown: "20",
    shortDescription: "Play rock-paper-scissors game with the bot.",
    category: "fun",
    guide: "{prefix}rps <✊|🖐️|✌️> <amount>"
  },
 langs: {
    en: {
      final: " | WAITING |",
      loading: "━━━━━━━━━━━━━━━\n⏳ | waiting \n━━━━━━━━━━━━━━━\n"
    }
  }
},
  onStart: async function ({ message, args, event, envCommands, usersData, api }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    const choices = ["✊", "🖐️", "✌️"];
    const userChoice = args[0];
    const amount = parseInt(args[1]);

    const userName = getLang("final");
    const loadingMessage = getLang("loading");
    const loadingReply = await message.reply(loadingMessage);

    if (!userChoice || !choices.includes(userChoice.toLowerCase())) {
      return api.editMessage(loadingReply.messageID, "Please choose either ✊, 🖐️, or ✌️");
    }

    if (isNaN(amount) || amount <= 0) {
      return api.editMessage(loadingReply.messageID, "Invalid amount! Please bet a positive number.");
    }

    if (amount > userData.money) {
      return api.editMessage(loadingReply.messageID, "You don't have enough money to place this bet.");
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    await api.editMessage(loadingReply.messageID, `You chose ${userChoice}. I chose ${botChoice}.`);

    if (userChoice.toLowerCase() === botChoice) {
      return api.editMessage(loadingReply.messageID, "It's a tie! ⚖️");
    }

    const userWins = 
      (userChoice.toLowerCase() === "✊" && botChoice === "✌️") ||
      (userChoice.toLowerCase() === "🖐️" && botChoice === "✊") ||
      (userChoice.toLowerCase() === "✌️" && botChoice === "🖐️");

    if (userWins) {
      await usersData.set(senderID, {
        ...userData,
        money: userData.money + amount
      });
      return api.editMessage(loadingReply.messageID, `Congratulations! You won ${amount} money! 🎉`);
    } else {
      await usersData.set(senderID, {
        ...userData,
        money: userData.money - amount
      });
      return api.editMessage(loadingReply.messageID, `I win! You lost ${amount} money! Better luck next time! 😎`);
    }
  }
};

// Language strings
