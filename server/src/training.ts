import * as fs from 'fs';
import {LanguageCode, LanguageSubModel} from './models';
import {cleanText} from './utils'

/**
 * Create tri-, bi- and unigrams for the given language, using all training texts in the 'dataset' folder
 * @param language the language to create the language model for
 */
const createLanguageModel = (language: LanguageCode) => {
  let trigrams: LanguageSubModel = {
    TOTAL: 0,
  };

  let bigrams: LanguageSubModel = {
    TOTAL: 0,
  };

  let unigrams: LanguageSubModel = {
    TOTAL: 0,
  };

  const trainingFiles = fs.readdirSync(`dataset/${language}`);

  for (const file of trainingFiles) {
    const rawText = fs.readFileSync(`dataset/${language}/${file}`, {
      encoding: 'utf-8',
    });
    const text = cleanText(rawText);

    console.time(`Trigram for ${language} - ${file}`);
    trigrams = createNgram(text, 3, trigrams);
    console.timeEnd(`Trigram for ${language} - ${file}`);

    console.time(`Bigram for ${language} - ${file}`);
    bigrams = createNgram(text, 2, bigrams);
    console.timeEnd(`Bigram for ${language} - ${file}`);

    console.time(`Unigram for ${language} - ${file}`);
    unigrams = createNgram(text, 1, unigrams);
    console.timeEnd(`Unigram for ${language} - ${file}`);
  }

  const languageModel = {
    trigrams,
    bigrams,
    unigrams,
  };

  fs.writeFileSync(
    `src/models/${language}.json`,
    JSON.stringify(languageModel)
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
  ngram?: LanguageSubModel
): LanguageSubModel => {
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
createLanguageModel('FR');
createLanguageModel('EN');
createLanguageModel('IT');
