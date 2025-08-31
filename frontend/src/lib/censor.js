import { badWords } from "./badWords";

export function shouldCensorMessage(message, threshold = 2) {
  if (!message || typeof message != "string") return false;

  const words = message.toLowerCase().split(/\W+/);

  let count = 0;

  for (const word of words) {
    if (badWords.includes(word)) {
      count++;
    }
  }

  return count >= threshold;
}
