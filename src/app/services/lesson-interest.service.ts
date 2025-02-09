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

  updateRequest(
    id: number,
    updateData: Partial<iLessonInterest>
  ): Observable<iLessonInterest> {
    let params = new HttpParams()
      .set('contacted', String(updateData.contacted)) // ✅ Converti i booleani in stringhe
      .set('interested', String(updateData.interested))
      .set('toBeRecontacted', String(updateData.toBeRecontacted))
      .set('handled', String(updateData.handled));

    if (updateData.note !== undefined && updateData.note !== null) {
      params = params.set('note', updateData.note); // ✅ Assicurati che il campo `note` venga incluso
    }

    return this.http.put<iLessonInterest>(
      `${this.lessonInterestUrl}/${id}/update-status`,
      {}, // ✅ Il body è vuoto perché stiamo usando query parameters
      { params: params }
    );
  }
  deleteRequest(id: number): Observable<any> {
    return this.http.delete(`${this.lessonInterestUrl}/${id}`);
  }
}
