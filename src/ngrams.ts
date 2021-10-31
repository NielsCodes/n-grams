import * as fs from 'fs';

const createModels = () => {
  const rawText = fs.readFileSync('dataset/alice_EN.txt', {encoding: 'utf-8'});
  const text = cleanText(rawText);
  fs.writeFileSync('output.txt', text);
};

/**
 * Cleans input text for n-gram processing
 *
 * - Removes non-neccessary characters marks
 * - Removes digits
 *
 * @param text raw input text
 * @returns cleaned text
 */
const cleanText = (text: string) => {
  return (
    text
      // Remove digits
      .replace(/[0-9]/gm, '')
      // Fix periods with leading whitespace (hello . world)
      .replace(/\s\./gm, '.')
      // Fix periods without trailing whitespace (hello.world)
      .replace(/\.(?=\S)/gm, '. ')
      // Remove all non-approved characters
      // Includes all punctuation, except for apostrophe
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s']/gm, '')
      // Remove all excess whitespace
      .replace(/\s\s+/gm, ' ')
      .toLowerCase()
  );
};

createModels();
