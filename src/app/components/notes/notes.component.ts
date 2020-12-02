import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Note } from 'src/app/models/note';
import { NoteService } from 'src/app/services/note.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, AfterViewInit {

  @ViewChild('searchBox')
  searchBox: ElementRef;
  displayedColumns: string[] = ['priority', 'title', 'delete'];
  notes: Note[];

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    this.getNotes();
  }

  ngAfterViewInit(): void {
    this.subscribeToSearch();
  }

  subscribeToSearch(): void {
    fromEvent(this.searchBox.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search: any) => {
          return this.noteService.getByTitle(search.target.value);
        })
      )
      .subscribe(notes => this.notes = notes);
  }

  getNotes(): void {
    this.noteService.getNotes()
      .subscribe(notes => this.notes = notes);
  }

  delete(note: Note): void {
    this.noteService.delete(note)
      .subscribe(() => this.notes = this.notes.filter(n => n !== note));
  }

  edit(note: Note): void {
    const url = `notes/${note.id}`;
    this.router.navigateByUrl(url);
  }
}
