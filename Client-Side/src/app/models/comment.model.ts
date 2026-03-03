export interface CommentDto {
  id: number;
  title: string;
  content: string;
  createdOn: string;
  createdBy: string;
  stockId: number | null;
}

export interface CreateCommentRequest {
  title: string;
  content: string;
}

export interface UpdateCommentRequest {
  title: string;
  content: string;
}
