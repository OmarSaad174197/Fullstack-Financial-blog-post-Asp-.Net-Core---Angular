import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CommentDto } from '../../models/comment.model';

@Component({
  selector: 'app-comments-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comments.page.html',
  styleUrl: './comments.page.css'
})
export class CommentsPageComponent implements OnInit {
  comments: CommentDto[] = [];
  selected: CommentDto | null = null;
  isLoading = true;
  error = '';
  actionMessage = '';

  findForm: FormGroup;
  createForm: FormGroup;
  updateForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly commentService: CommentService) {
    this.findForm = this.fb.group({
      id: [null, [Validators.required]]
    });

    this.createForm = this.fb.group({
      stockId: [null, [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.updateForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.error = '';
    this.commentService.getAll().subscribe({
      next: (data) => {
        this.comments = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load comments right now.';
        this.isLoading = false;
      }
    });
  }

  selectComment(comment: CommentDto): void {
    this.selected = comment;
    this.updateForm.patchValue({
      title: comment.title,
      content: comment.content
    });
  }

  clearSelection(): void {
    this.selected = null;
    this.updateForm.reset();
  }

  findById(): void {
    if (this.findForm.invalid) return;
    const id = Number(this.findForm.value.id ?? 0);
    this.commentService.getById(id).subscribe({
      next: (comment) => {
        this.selectComment(comment);
        this.actionMessage = `Loaded comment #${comment.id}.`;
      },
      error: () => {
        this.actionMessage = 'Comment not found.';
      }
    });
  }

  createComment(): void {
    if (this.createForm.invalid) return;
    const stockId = Number(this.createForm.value.stockId ?? 0);
    const payload = {
      title: this.createForm.value.title ?? '',
      content: this.createForm.value.content ?? ''
    };

    this.commentService.create(stockId, payload).subscribe({
      next: (comment) => {
        this.actionMessage = `Created comment #${comment.id}.`;
        this.createForm.reset();
        this.loadComments();
      },
      error: () => {
        this.actionMessage = 'Unable to create comment.';
      }
    });
  }

  updateComment(): void {
    if (!this.selected || this.updateForm.invalid) return;
    const payload = {
      title: this.updateForm.value.title ?? '',
      content: this.updateForm.value.content ?? ''
    };
    this.commentService.update(this.selected.id, payload).subscribe({
      next: () => {
        this.actionMessage = `Updated comment #${this.selected?.id}.`;
        this.loadComments();
      },
      error: () => {
        this.actionMessage = 'Unable to update comment.';
      }
    });
  }

  deleteComment(): void {
    if (!this.selected) return;
    this.commentService.delete(this.selected.id).subscribe({
      next: () => {
        this.actionMessage = `Deleted comment #${this.selected?.id}.`;
        this.clearSelection();
        this.loadComments();
      },
      error: () => {
        this.actionMessage = 'Unable to delete comment.';
      }
    });
  }
}
