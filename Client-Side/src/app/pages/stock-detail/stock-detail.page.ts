import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { StockDto } from '../../models/stock.model';
import { CommentDto } from '../../models/comment.model';

@Component({
  selector: 'app-stock-detail-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './stock-detail.page.html',
  styleUrl: './stock-detail.page.css'
})
export class StockDetailPageComponent implements OnInit {
  stock: StockDto | null = null;
  isLoading = true;
  error = '';
  editCommentId: number | null = null;

  commentForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stockService: StockService,
    private readonly commentService: CommentService,
    private readonly authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid stock id.';
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.stockService.getById(id).subscribe({
      next: (stock) => {
        this.stock = stock;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load stock details.';
        this.isLoading = false;
      }
    });
  }

  startEdit(comment: CommentDto): void {
    this.editCommentId = comment.id;
    this.commentForm.patchValue({
      title: comment.title,
      content: comment.content
    });
  }

  cancelEdit(): void {
    this.editCommentId = null;
    this.commentForm.reset();
  }

  submitComment(): void {
    if (!this.stock || this.commentForm.invalid) return;
    const payload = {
      title: this.commentForm.value.title ?? '',
      content: this.commentForm.value.content ?? ''
    };

    if (this.editCommentId) {
      this.commentService.update(this.editCommentId, payload).subscribe({
        next: () => {
          this.cancelEdit();
          this.loadStock();
        },
        error: () => {
          this.error = 'Unable to update comment.';
        }
      });
      return;
    }

    this.commentService.create(this.stock.id, payload).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadStock();
      },
      error: () => {
        this.error = 'Unable to add comment.';
      }
    });
  }

  deleteComment(commentId: number): void {
    this.commentService.delete(commentId).subscribe({
      next: () => this.loadStock(),
      error: () => {
        this.error = 'Unable to delete comment.';
      }
    });
  }

  deleteStock(): void {
    if (!this.stock) return;
    this.stockService.delete(this.stock.id).subscribe({
      next: () => this.router.navigate(['/stocks']),
      error: () => {
        this.error = 'Unable to delete stock.';
      }
    });
  }
}
