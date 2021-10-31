import { Component, OnInit } from '@angular/core';
import {NgramsService} from './services/ngrams.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'language-classification';

  inputText = '';
  predictedLanguage: string | null = null;
  modelChoice: 'trigrams' | 'bigrams' = 'trigrams';

  constructor(private ngram: NgramsService) {}

  ngOnInit() {}

  onChange() {
    let orderModel = 3;
    if (this.modelChoice === 'bigrams') {
      orderModel = 2;
    }

    const predictedLanguageCode = this.ngram.classifyText(this.inputText, orderModel as 3 | 2);
    if (predictedLanguageCode) {
      this.predictedLanguage = this.languageDefinition[predictedLanguageCode];
    } else {
      this.predictedLanguage = null;
    }
  }

  private languageDefinition = {
    DE: 'German',
    FR: 'French',
    EN: 'English',
    IT: 'Italian',
    PT: 'Portuguese',
    SP: 'Spanish',
  }

}
