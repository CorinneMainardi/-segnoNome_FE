import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iDictionary } from '../interfaces/i-dictionary';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { iVideoClass } from '../interfaces/i-video-class';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  dictionaryUrl: string = environment.dictionaryUrl;

  private dictionarySubject = new BehaviorSubject<iDictionary[]>([]);
  dictionary$ = this.dictionarySubject.asObservable();
  constructor(private http: HttpClient) {}

  getAllDictionaryVideos() {
    return this.http
      .get<iDictionary[]>(this.dictionaryUrl)
      .pipe(
        tap((dictionaryVideos) => this.dictionarySubject.next(dictionaryVideos))
      );
  }

  getVideoDictionaryById(id: number) {
    return this.http.get<iDictionary>(`${this.dictionaryUrl}/${id}`);
  }

  // Aggiunge una nuova storia e aggiorna il BehaviorSubject
  createDictionaryVideo(newVideoDictionary: iDictionary) {
    return this.http
      .post<iDictionary>(
        this.dictionaryUrl,
        JSON.stringify(newVideoDictionary),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        tap((addedVideoDictionary) => {
          const currentVideoDictionary = this.dictionarySubject.getValue();
          this.dictionarySubject.next([
            ...currentVideoDictionary,
            addedVideoDictionary,
          ]);
        })
      );
  }

  updateDictionaryVideo(id: number, updatedDictionaryVideo: iDictionary) {
    return this.http
      .put<iDictionary>(`${this.dictionaryUrl}/${id}`, updatedDictionaryVideo)
      .pipe(
        tap((updatedDictionaryV) => {
          const currentVideoDictionary = this.dictionarySubject.getValue();
          const updatedDictionaryVideo = currentVideoDictionary.map((vd) =>
            vd.id === id ? updatedDictionaryV : vd
          );
          this.dictionarySubject.next(updatedDictionaryVideo);
        })
      );
  }

  // Elimina una video  per indice e aggiorna il BehaviorSubject
  deleteDictionaryVideo(id: number) {
    return this.http.delete<void>(`${this.dictionaryUrl}/${id}`).pipe(
      tap(() => {
        const currentVideoDictionary = this.dictionarySubject.getValue();
        const updatedDictionaryVideo = currentVideoDictionary.filter(
          (vd) => vd.id !== id
        );
        this.dictionarySubject.next(updatedDictionaryVideo);
      })
    );
  }
}
