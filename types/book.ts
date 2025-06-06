export interface Book {
  id: string;
  title: string;
  author: string | null;
  genre: string;
  started: string;
  rating: string | null;
  critic: string | null;
  created_at: string;
  favorite: boolean;
}
