import { CommentDto } from './comment.model';

export interface StockDto {
  id: number;
  symbol: string;
  companyName: string;
  purchase: number;
  lastDiv: number;
  industry: string;
  marketCapacity: number;
  comments: CommentDto[];
}

export interface AddStockRequest {
  symbol: string;
  companyName: string;
  purchase: number;
  lastDiv: number;
  industry: string;
  marketCapacity: number;
}

export interface UpdateStockRequest {
  symbol: string;
  companyName: string;
  purchase: number;
  lastDiv: number;
  industry: string;
  marketCapacity: number;
}

export interface StockQuery {
  symbol?: string;
  companyName?: string;
  sortBy?: string;
  isDescinding?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
