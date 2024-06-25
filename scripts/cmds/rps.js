module.exports = {
  config: {
    name: "rps",
    version: "1.0",
    author: "Loid",
    countDown: "20",
    shortDescription: "Play rock-paper-scissors game with the bot.",
    category: "fun",
    guide: "{prefix}rps <✊|paper🖐️|scissors✌️> <amount>"
  },
  onStart: async function ({ message, args, event, envCommands, usersData }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    const choices = ["✊", "🖐️", "✌️"];
    const userChoice = args[0];
    const amount = parseInt(args[1]);

    if (!userChoice || !choices.includes(userChoice.toLowerCase())) {
      return message.reply("Please choose either ✊, 🖐️, or ✌️");
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply("Invalid amount! Please bet a positive number.");
    }

    if (amount > userData.money) {
      return message.reply("You don't have enough money to place this bet.");
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    message.reply(`You chose ${userChoice}. I chose ${botChoice}.`);

    if (userChoice.toLowerCase() === botChoice) {
      return message.reply("It's a tie! ⚖️");
    }

    const userWins = 
      (userChoice.toLowerCase() === "✊" && botChoice === "✌️") ||
      (userChoice.toLowerCase() === "🖐️" && botChoice === "✊") ||
      (userChoice.toLowerCase() === "✌️" && botChoice === "🖐️");

    if (userWins) {
      await usersData.set(senderID, {
        ...userData,
        money: userData.money + (amount * 2)
      });
      return message.reply(`Congratulations! You won ${amount} money! 🎉`);
    } else {
      await usersData.set(senderID, {
        ...userData,
        money: userData.money - amount
      });
      return message.reply(`I win! You lost ${amount} money! Better luck next time! 😎`);
    }
  }
};
