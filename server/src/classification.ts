import {cleanText} from './utils';
import {
  LanguageCode,
  LanguageChances,
  LanguageSubModel,
  LanguageModel,
} from './models';

import languageModelDE from '../src/models/DE.json';
import languageModelFR from '../src/models/FR.json';
import languageModelEN from '../src/models/EN.json';
import languageModelIT from '../src/models/IT.json';
import languageModelPT from '../src/models/PT.json';
import languageModelSP from '../src/models/SP.json';

const classifyText = (text: string, n: 3 | 2): LanguageCode => {
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
  console.log(text);

  return 'DE';
};

const updateChances = (
  token: string,
  chances: LanguageChances
): LanguageChances => {
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

const calculateChance = (token: string, model: LanguageSubModel) => {
  if (!(token in model)) return 0.000001;
  const total = model.TOTAL;
  const occurences = model[token];
  const chance = (occurences / total) * 1000;
  return chance;
};

console.time();
// const testText =
  // 'In den Jahren 1893 und 1894 rüstete die "Maatschappij totbevordering van het natuurkundig onderzoek der Nederlandsche Koloniën (Gesellschaft zur Beförderung der naturwissenschaftlichen Forschung in den niederländischen Kolonieen) ihre erste grosse wissenschaftliche Expedition nach Mittel-Borneo aus; wesentlich unterstützt wurdesie dabei durch den damaligen Residenten _S.W. Tromp_ [2] der Wester-Afdeeling von Borneo, der sehr wohl begriff, dass eine Erweiterung der Kenntnis von Land und Volk auch in politischer Hinsicht von grosser Bedeutung sein musste. Den Teilnehmern an der Expedition war zur Aufgabe gestellt worden, von der Westküste durch die bisher ganz unbekannten Gebiete des oberen Kapuas und oberen Mahakam bis zur Ostküste vorzudringen und während der Reise, so weit als möglich, naturwissenschaftliches Material zu sammeln und die Bevölkerung zu studieren. In Kutei erhoben sich aber bald warnende Stimmen, welche auf die grossen Gefahren einer derartigen Unternehmung aufmerksam machten; daher nahm man von dem anfänglichen Plan Abstand und beschränkte sich auf die Erforschung des Flussgebietes des oberen Kapuas, in welchem vom November 1893 bis zum Oktober 1894 reiche Sammlungen auf botanischem, zoologischem, geologischem und ethnologischem Gebiete angelegt wurden. Dank der Unterstützung der Regierung durch Schutz- und Transportmittel konnten die Forscher, jeder in seinem Fache, gesondert tätig sein; während der Zoologe Dr. _J.  Büttikofer_ und der Botaniker Dr. _H. Hallier_ sich im Urwalde niederliessen, durchzog der Geologe Prof. _G.A.F. Molengraaff_ ausgedehnte Landstrecken,  um deren Formation kennen zu lernen und beendete seine Reise durch  einen gelungenen Zug von Bunut südlich nach Bandjarmasin. Indessen  jeder auf diese Weise die nötige Forschungsfreiheit genoss, lag mir,  als dem Expeditionsarzte, die Verwaltung des Ganzen ob. Da meine  ärztliche Hilfe von den Teilnehmern der Expedition selten beansprucht  wurde, konnte ich in den Dörfern der Eingeborenen wohnen bleiben und  von dort aus für die Zufuhr neuer Vorräte und die Anwerbung von Kuli  Sorge tragen.';
const testText = 'Luciano tem oito anos e possui uma família que admira muito. Ele gosta de desenhar seus familiares quando está de férias. Sua mãe chama-se Olívia e tem cabelos castanhos e longos. Ela gosta de assistir novelas e cultivar um jardim de rosas brancas.';
classifyText(testText, 3);
console.timeEnd();
