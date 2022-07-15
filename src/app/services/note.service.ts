import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Note } from '../models/note';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(ApiUrl.notes);
  }

  search(value: string): Observable<Note[]> {
    if (!value) {
      return this.getNotes();
    }
    return this.http.get<Note[]>(ApiUrl.notesSearch, {
      params: new HttpParams()
        .set(`value`, value)
    });
  }

  getNote(id: number): Observable<Note> {
    const url = `${ApiUrl.notes}/${id}`;

    return this.http.get<Note>(url);
  }

  saveNote(note: Note): Observable<Note> {
    return this.http.post<Note>(ApiUrl.notes, note);
  }

  updateNote(note: Note): Observable<Note> {
    const url = `${ApiUrl.notes}/${note.id}`;

    return this.http.put<Note>(url, note);
  }

  delete(note: Note | number): Observable<void> {
    const id = typeof note === 'number' ? note : note.id;
    const url = `${ApiUrl.notes}/${id}`;

    return this.http.delete<void>(url);
  }
}
