import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Note } from 'src/app/models/note';
import { NoteService } from 'src/app/services/note.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Priority } from 'src/app/enums/priority.enum';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css']
})
export class NoteDetailsComponent implements OnInit {

  priorities = [];
  note: Note;

  constructor(private route: ActivatedRoute, private router: Router, private noteService: NoteService, private location: Location) { }

  ngOnInit(): void {
    this.priorities = Object.keys(Priority)
      .filter(key => isNaN(+key));
    this.getNote();
  }

  getNote(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.noteService.getNote(id)
      .subscribe(note => this.note = note);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.noteService.updateNote(this.note)
      .subscribe(note => {
        this.note = note;
        this.router.navigateByUrl('notes');
      });
  }

  setPriority(priority: Priority): void {
    this.note.priority = priority;
  }
}
