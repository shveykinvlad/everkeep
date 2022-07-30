import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Priority } from 'src/app/enums/priority.enum';
import { Note } from 'src/app/models/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css']
})
export class NoteDetailsComponent implements OnInit {

  priorities = [];
  id: number;
  form = this.formBuilder.group({
    title: ['', [Validators.required]],
    text: ['', [Validators.required]],
    priority: [Priority.NONE],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.id = this.getPathId();
    this.priorities = Object.keys(Priority)
      .filter(key => isNaN(+key));
  }

  ngOnInit(): void {
    if (!Number.isNaN(this.id)) {
      this.noteService.getNote(this.id)
        .subscribe(note => this.form.patchValue(note));
    }
  }

  goBack(): void {
    this.location.back();
  }

  submit(): void {
    const note: Note = this.createNote();

    if (Number.isNaN(this.id)) {
      this.save(note);
    } else {
      this.update(note);
    }
  }

  private save(note: Note): void {
    this.noteService.saveNote(note)
      .subscribe(() => {
        this.router.navigateByUrl('notes');
      });
  }

  private update(note: Note): void {
    this.noteService.updateNote(note)
      .subscribe(() => {
        this.router.navigateByUrl('notes');
      });
  }

  private createNote(): Note {
    const id = this.id;
    const title = this.form.value.title;
    const text = this.form.value.text;
    const priority = this.form.value.priority;

    const note: Note = { id, title, text, priority };

    return note;
  }

  private getPathId(): number {
    return +this.route.snapshot.paramMap.get('id');
  }
}
