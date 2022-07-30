import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../models/note';

const NOTES_URL: string = `${environment.apiUrl}/notes`;
const SEARCH_URL: string = `${NOTES_URL}/search`;
const VALUE_PARAM: string = 'value';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    private http: HttpClient
  ) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(NOTES_URL);
  }

  search(value: string): Observable<Note[]> {
    if (!value) {
      return this.getNotes();
    }
    return this.http.get<Note[]>(SEARCH_URL, {
      params: new HttpParams()
        .set(VALUE_PARAM, value)
    });
  }

  getNote(id: number): Observable<Note> {
    const url = `${NOTES_URL}/${id}`;

    return this.http.get<Note>(url);
  }

  saveNote(note: Note): Observable<Note> {
    return this.http.post<Note>(NOTES_URL, note);
  }

  updateNote(note: Note): Observable<Note> {
    const url = `${NOTES_URL}/${note.id}`;

    return this.http.put<Note>(url, note);
  }

  delete(note: Note | number): Observable<void> {
    const id = typeof note === 'number' ? note : note.id;
    const url = `${NOTES_URL}/${id}`;

    return this.http.delete<void>(url);
  }
}
