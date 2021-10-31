import * as fs from 'fs';
import {LanguageCodes, LanguageModel} from './models';

/**
 * Create tri-, bi- and unigrams for the given language, using all training texts in the 'dataset' folder
 * @param language the language to create the language model for
 */
const createLanguageModel = (language: LanguageCodes) => {
  let trigram: LanguageModel = {
    TOTAL: 0,
  };

  let bigram: LanguageModel = {
    TOTAL: 0,
  };

  let unigram: LanguageModel = {
    TOTAL: 0,
  };

  const trainingFiles = fs.readdirSync(`dataset/${language}`);

  for (const file of trainingFiles) {
    const rawText = fs.readFileSync(`dataset/${language}/${file}`, {
      encoding: 'utf-8',
    });
    const text = cleanText(rawText);

    console.time(`Trigram for ${file}`);
    trigram = createNgram(text, 3, trigram);
    console.timeEnd(`Trigram for ${file}`);

    console.time(`Bigram for ${file}`);
    bigram = createNgram(text, 2, bigram);
    console.timeEnd(`Bigram for ${file}`);

    console.time(`Unigram for ${file}`);
    unigram = createNgram(text, 1, unigram);
    console.timeEnd(`Unigram for ${file}`);
  }

  fs.writeFileSync(`models/${language}_trigram.json`, JSON.stringify(trigram));
  fs.writeFileSync(`models/${language}_bigram.json`, JSON.stringify(bigram));
  fs.writeFileSync(`models/${language}_unigram.json`, JSON.stringify(unigram));
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

/**
 * Create an n-gram model based on input text
 * @param text the text to extract the language model from
 * @param n the order Markov model to create (3 --> trigram, 2 --> bigram)
 * @param ngram OPTIONAL: an existing ngram model to extend
 * @returns an n-gram language model in JSON format
 */
const createNgram = (
  text: string,
  n: number,
  ngram?: LanguageModel
): LanguageModel => {
  ngram = ngram ?? {
    TOTAL: 0,
  };
  for (let i = 0; i < text.length - (n - 1); i++) {
    const token = text.substr(i, n);

    if (token in ngram) {
      ngram[token]++;
    } else {
      ngram[token] = 1;
    }
    ngram.TOTAL++;
  }
  return ngram;
};

createLanguageModel('DE');
