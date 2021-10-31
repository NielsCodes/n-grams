import { Injectable } from '@angular/core';
import {
  LanguageCode,
  LanguageChances,
  LanguageSubModel,
  LanguageModel,
} from '../models';

import languageModelDE from '../models/DE.json';
import languageModelFR from '../models/FR.json';
import languageModelEN from '../models/EN.json';
import languageModelIT from '../models/IT.json';
import languageModelPT from '../models/PT.json';
import languageModelSP from '../models/SP.json';

@Injectable({
  providedIn: 'root'
})
export class NgramsService {

  constructor() { }

  /**
   * Cleans input text for n-gram processing
   *
   * - Removes non-neccessary characters marks
   * - Removes digits
   *
   * @param text raw input text
   * @returns cleaned text
   */
  function cleanText(text: string): string {
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
   * Calculates the likeliness of a given token string being part of the same language as given language model
   * @param token the current token string (2- or 3-character string)
   * @param model the language model to compare the token to
   * @returns the chance that the token is in the same language as the model
   */
  function calculateChance(token: string, model: LanguageSubModel): number {
    if (!(token in model)) return 0.000001;
    const total = model.TOTAL;
    const occurences = model[token];
    const chance = (occurences / total) * 1000;
    return chance;
  };

  /**
   * Update an existing chances object with a new token
   *
   * - Token is used to generate chances
   * - Passed object is updated to reflect new chances
   *
   * @param token the current token string (2- or 3-character string)
   * @param chances the current chances object
   * @returns an updates chances object
   */
  function updateChances = (token: string, chances: LanguageChances): LanguageChances {
    let type = 'trigrams';
    switch (token.length) {
      case 2:
        type = 'bigrams';
        break;
      case 1:
        type = 'unigrams';
        break;
    }

    // Find chance per language
    chances.DE *= calculateChance(
      token,
      (languageModelDE as LanguageModel)[type]
    );
    chances.FR *= calculateChance(
      token,
      (languageModelFR as LanguageModel)[type]
    );
    chances.EN *= calculateChance(
      token,
      (languageModelEN as LanguageModel)[type]
    );
    chances.IT *= calculateChance(
      token,
      (languageModelIT as LanguageModel)[type]
    );
    chances.PT *= calculateChance(
      token,
      (languageModelPT as LanguageModel)[type]
    );
    chances.SP *= calculateChance(
      token,
      (languageModelSP as LanguageModel)[type]
    );

    return chances;
  };

  /**
   * Parses an input text and returns the predicted language based on n-gram comparison
   * @param text the input text to run the classification on
   * @param n which order of Markov model to use (trigrams or bigrams)
   * @returns a two-letter language code prediction
   */
  function classifyText = (text: string, n: 3 | 2): LanguageCode | null {
    text = cleanText(text);

    // Products of trigrams (if n === 3)
    // Products of bigrams (if n === 2)
    let nChances = {
      DE: 0.0001,
      FR: 0.0001,
      EN: 0.0001,
      IT: 0.0001,
      PT: 0.0001,
      SP: 0.0001,
    };

    // Products of bigrams (if n === 3)
    // Products of unigrams (if n === 2)
    let nMinusChances = {
      DE: 0.0001,
      FR: 0.0001,
      EN: 0.0001,
      IT: 0.0001,
      PT: 0.0001,
      SP: 0.0001,
    };

    for (let i = 0; i < text.length - (n - 1); i++) {
      const nToken = text.substr(i, n);
      nChances = updateChances(nToken, nChances);
      console.log({nChances});
      let nMinusToken;
      if (i !== 0) {
        nMinusToken = text.substr(i, n - 1);
        nMinusChances = updateChances(nMinusToken, nMinusChances);
        console.log({nMinusChances});
      }
    }

    const chances: LanguageChances = {
      DE: nChances.DE / nMinusChances.DE,
      FR: nChances.FR / nMinusChances.FR,
      EN: nChances.EN / nMinusChances.EN,
      IT: nChances.IT / nMinusChances.IT,
      PT: nChances.PT / nMinusChances.PT,
      SP: nChances.SP / nMinusChances.SP,
    };

    let highestChance = -Infinity;
    let likeliestLanguage = null;
    for (const [key, value] of Object.entries(chances)) {
      if (value > highestChance) {
        highestChance = value;
        likeliestLanguage = key;
      }
    }

    console.log(`Prediction: ${likeliestLanguage}`);
    return likeliestLanguage as LanguageCode;
  };

}
