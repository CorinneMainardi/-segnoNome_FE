import { iVideoClass } from './../interfaces/i-video-class';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoclassesService {
  videoclassesUrl: string = environment.videoclassesUrl;
  private videoClassesSubject = new BehaviorSubject<iVideoClass[]>([]);
  videoClasses$ = this.videoClassesSubject.asObservable();
  constructor(private http: HttpClient) {}

  getAllVideoClasses() {
    return this.http
      .get<iVideoClass[]>(this.videoclassesUrl)
      .pipe(tap((videoclasses) => this.videoClassesSubject.next(videoclasses)));
  }

  getVideoClassById(id: number) {
    return this.http.get<iVideoClass>(`${this.videoclassesUrl}/${id}`);
  }

  // createVideoClass(newVideoClass: iVideoClass) {
  //   const token =
  //     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjcmVhdG9yIiwicm9sZXMiOlsiUk9MRV9DUkVBVE9SIl0sImlhdCI6MTczODc1NjkyOCwiZXhwIjoxNzM4NzYwNTI4fQ.-1Y-YKGf254POiF8K8JZVxr4ynqajXnLFJYlmN3awQw'; // Sostituisci con il token reale

  //   return this.http
  //     .post<iVideoClass>(this.videoclassesUrl, newVideoClass, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .pipe(
  //       tap((addedVideoClass) => {
  //         const currentVideoClasses = this.videoClassesSubject.getValue();
  //         this.videoClassesSubject.next([
  //           ...currentVideoClasses,
  //           addedVideoClass,
  //         ]); // Aggiunge la nuova video class alla lista
  //       })
  //     );
  // }

  // Aggiunge una nuova storia e aggiorna il BehaviorSubject
  createVideoClass(newVideoClass: iVideoClass) {
    return this.http
      .post<iVideoClass>(this.videoclassesUrl, JSON.stringify(newVideoClass), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((addedVideoClass) => {
          const currentVideoClasses = this.videoClassesSubject.getValue();
          this.videoClassesSubject.next([
            ...currentVideoClasses,
            addedVideoClass,
          ]);
        })
      );
  }

  updateVideoClass(id: number, updatedVideoClass: iVideoClass) {
    return this.http
      .put<iVideoClass>(`${this.videoclassesUrl}/${id}`, updatedVideoClass)
      .pipe(
        tap((updatedClass) => {
          const currentVideoClasses = this.videoClassesSubject.getValue();
          const updatedVideoClasses = currentVideoClasses.map((vc) =>
            vc.id === id ? updatedClass : vc
          );
          this.videoClassesSubject.next(updatedVideoClasses);
        })
      );
  }

  // Elimina una storia per indice e aggiorna il BehaviorSubject
  deleteVideoClass(id: number) {
    return this.http.delete<void>(`${this.videoclassesUrl}/${id}`).pipe(
      tap(() => {
        const currentVideoClasses = this.videoClassesSubject.getValue();
        const updatedVideoClasses = currentVideoClasses.filter(
          (vc) => vc.id !== id
        );
        this.videoClassesSubject.next(updatedVideoClasses);
      })
    );
  }
}
