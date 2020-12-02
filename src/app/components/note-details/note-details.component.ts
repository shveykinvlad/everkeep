import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Note } from 'src/app/models/note';
import { NoteService } from 'src/app/services/note.service';
import { Priority } from 'src/app/enums/priority.enum';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css']
})
export class NoteDetailsComponent implements OnInit {

  priorities = [];
  id: number;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private noteService: NoteService, private location: Location) {
    this.id = this.getPathId();
    this.priorities = Object.keys(Priority)
      .filter(key => isNaN(+key));
  }

  ngOnInit(): void {
    this.initForm();

    if (!Number.isNaN(this.id)) {
      this.noteService.getNote(this.id)
        .subscribe(note => this.form.patchValue(note));
    }
  }

  goBack(): void {
    this.location.back();
  }

  submit(): void {
    const note: Note = {
      id: this.id,
      title: this.form.get('title').value,
      text: this.form.get('text').value,
      priority: this.form.get('priority').value
    };

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

  private initForm(): void {
    this.form = new FormGroup({
      title: new FormControl(),
      text: new FormControl(),
      priority: new FormControl()
    });
  }

  private getPathId(): number {
    return +this.route.snapshot.paramMap.get('id');
  }
}
