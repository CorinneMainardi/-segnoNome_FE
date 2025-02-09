import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { iLessonInterest } from '../interfaces/i-lesson-interest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LessonInterestService {
  private lessonInterestUrl = environment.lessonInterestUrl;
  constructor(private http: HttpClient) {}

  createRequest(request: iLessonInterest): Observable<any> {
    return this.http.post(`${this.lessonInterestUrl}/create`, request);
  }

  getAllRequests(): Observable<iLessonInterest[]> {
    return this.http.get<iLessonInterest[]>(`${this.lessonInterestUrl}/all`);
  }

  getHandledRequests(): Observable<iLessonInterest[]> {
    return this.http.get<iLessonInterest[]>(
      `${this.lessonInterestUrl}/handled`
    );
  }

  getPendingRequests(): Observable<iLessonInterest[]> {
    return this.http.get<iLessonInterest[]>(
      `${this.lessonInterestUrl}/pending`
    );
  }

  updateRequest(id: number, updateData: Partial<iLessonInterest>) {
    const params = new HttpParams()
      .set('contacted', updateData.contacted!.toString())
      .set('interested', updateData.interested!.toString())
      .set('toBeRecontacted', updateData.toBeRecontacted!.toString())
      .set('handled', updateData.handled!.toString());

    // Aggiungi la nota solo se esiste
    if (updateData.note) {
      params.set('note', updateData.note);
    }

    return this.http.put(
      `${this.lessonInterestUrl}/${id}/update-status`,
      {}, // ❌ Il body è vuoto perché stiamo usando query parameters!
      { params: params }
    );
  }

  deleteRequest(id: number): Observable<any> {
    return this.http.delete(`${this.lessonInterestUrl}/${id}`);
  }
}
