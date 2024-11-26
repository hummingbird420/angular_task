import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, share, shareReplay, take, tap } from 'rxjs/operators';
import { TableColumnInfo } from '../main/components/table';
import { LanguageInfo, WordInfo } from '../models';
import { AuthService } from './auth.service';

export const translatedWords: Map<string, string> = new Map<string, string>();

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  languageId: number = 0;

  constructor(private http: HttpClient, private authService: AuthService) {
    authService.getUser().subscribe((user) => {
      if (user) this.languageId = user.languageId;
    });
  }

  getDatatableColumns(): Observable<TableColumnInfo[]> {
    return this.http.get<TableColumnInfo[]>('dictionary/datatable-columns');
  }

  getLanguages(): Observable<LanguageInfo[]> {
    return this.http.get<LanguageInfo[]>('dictionary/languages');
  }

  getLanguageInfo(languageId: number): Observable<LanguageInfo> {
    return this.http.get<LanguageInfo>('dictionary/language/' + languageId);
  }

  getTranslationOrWord(word: string): string {
    if (this.languageId == 0 || word.trim().length < 1) {
      return word;
    }
    let translatedWord = translatedWords.get(word);
    return translatedWord ? translatedWord : word;
  }

  getTranslatedWord(word: string): Observable<string> {
    if (this.languageId == 0 || word.trim().length < 1) {
      return of(word);
    }

    let translatedWord = translatedWords.get(word);
    if (translatedWord) {
      return of(translatedWord);
    }

    return this.http
      .post<{ translatedWord: string }>('dictionary/translated-word/', {
        word: word,
      })
      .pipe(
        map((data) => {
          translatedWords.set(word, data.translatedWord);
          return data.translatedWord;
        }),
        shareReplay(1)
      );
  }

  loadTranslatedWords(words: string[]) {
    const newWords = [];
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!translatedWords.has(word)) {
        newWords.push(word);
      }
    }
    if (newWords.length) {
      this.http
        .post<any>('dictionary/translated-words', words)
        .pipe(take(1))
        .subscribe((translations) => {
          for (const word in translations) {
            if (Object.prototype.hasOwnProperty.call(translations, word)) {
              translatedWords.set(word, translations[word]);
            }
          }
        });
    }
  }

  getWords(letter: string, languageId: number): Observable<WordInfo[]> {
    return this.http.get<WordInfo[]>(
      'dictionary//words/' + letter + '/' + languageId
    );
  }

  saveWords(words: WordInfo[], languageInfo: LanguageInfo): Observable<any> {
    return this.http.post<any>('dictionary/save-language', languageInfo).pipe(
      mergeMap((data) => {
        return this.http
          .post<any>('dictionary/save-words/' + data.languageId, words)
          .pipe(
            map((data) => {
              translatedWords.clear();
              return data;
            })
          );
      })
    );
  }
}
