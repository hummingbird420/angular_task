import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, take, takeUntil } from 'rxjs/operators';
import { LanguageInfo, WordInfo } from 'src/app/models';
import { DictionaryService } from 'src/app/services';
import { AlertService } from 'src/app/services/alert.service';
import { OrbundValidators } from 'src/app/util';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage extends Page implements OnInit, OnDestroy {
  currentLetter: string = 'A';
  languageId: number = 0;
  words: WordInfo[];
  languageInfo: LanguageInfo;
  languageFormGroup: FormGroup;
  wordsFormGroup: FormGroup;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionaryService: DictionaryService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Dictionary', '/setup/customization/dictionary'),
      createBreadcrumb('Language', undefined, true),
    ];
    this.rightLinkUrl = 'language-info-right-links';
    this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((param) => {
      this.languageId = parseInt(param.get('id') || '0');
    });

    this.words = [];
    this.languageInfo = {
      languageId: this.languageId,
      languageName: '',
      direction: 0,
    };
    this.languageFormGroup = this.formBuilder.group({});
    this.wordsFormGroup = this.formBuilder.group({});
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    if (this.languageId > 0) {
      this.dictionaryService
        .getLanguageInfo(this.languageId)
        .pipe(
          map((languageInfo) => {
            const controls: { [key: string]: FormControl } = {};
            controls['languageName'] = new FormControl(
              languageInfo.languageName,
              [
                OrbundValidators.required(
                  'Language Name',
                  this.dictionaryService
                ),
                OrbundValidators.maxLength(250, this.dictionaryService),
              ]
            );
            controls['languageName'] = new FormControl(languageInfo.direction);
            this.languageFormGroup = this.formBuilder.group(controls);
            return languageInfo;
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe((languageInfo) => (this.languageInfo = languageInfo));
    }

    this.getWords(this.currentLetter);
  }

  getWords(letter: string) {
    this.currentLetter = letter;
    this.dictionaryService
      .getWords(letter, this.languageId)
      .pipe(
        map((words) => {
          const controls: { [key: string]: FormControl } = {};
          words.forEach((word) => {
            controls['w' + word.wordId] = new FormControl(word.translatedWord);
          });
          this.wordsFormGroup = this.formBuilder.group(controls);
          return words;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((words) => {
        this.words = words;
        this.cdRef.detectChanges();
      });
  }

  saveWords() {
    if (this.languageInfo) {
      const languageName = this.languageInfo.languageName;
      if (languageName && languageName.trim() !== '') {
        this.dictionaryService
          .saveWords(this.words, this.languageInfo)
          .pipe(take(1))
          .subscribe((data) => {
            if (data.success) {
              this.alertService.showAlert('Data Saved successfuly.');
            }
          });
      } else {
        this.alertService.showErrorAlert('Please enter language name.');
      }
    }
  }
}
