const loveQuotes = [
  "In all the world, there is no heart for me like yours.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "You are my today and all of my tomorrows.",
  "Every time I see you, I fall in love all over again.",
  "You are the finest, loveliest, tenderest, and most beautiful person I have ever known—and even that is an understatement.",
  "I love you more than yesterday, less than tomorrow.",
  "You are my sun, my moon, and all my stars.",
  "To love and be loved is to feel the sun from both sides.",
  "You make my heart smile.",
  "Life is beautiful because of you.",
  "Your love shines in my heart as the sun shines upon the earth.",
  "You are the last thought in my mind before I drift off to sleep and the first thought when I wake up each morning.",
  "Every moment spent with you is like a beautiful dream come true.",
  "You are my paradise and I would happily get stranded on you for a lifetime.",
  "My heart is perfect because you are inside.",
  "I love you more than pizza, and that's saying a lot.",
  "You're my favorite notification.",
  "You're my favorite place to go when my mind searches for peace.",
  "Thank you for making my heart smile every single day.",
  "You're the first person I want to talk to when I wake up and the last person I want to hear from before I go to sleep.",
  "Your smile is literally the cutest thing I've ever seen in my life.",
  "You're my favorite thing to think about.",
  "Being with you makes me feel like I'm on top of the world.",
  "You make my heart dance.",
  "Every love story is beautiful, but ours is my favorite."
];

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * loveQuotes.length);
  return loveQuotes[randomIndex];
};

module.exports = {
  getRandomQuote
};
