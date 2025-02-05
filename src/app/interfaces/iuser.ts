import { iVideoClass } from './i-video-class';

export interface iUser {
  id?: number;
  username: string;
  password: string;
  email?: string; // opzionale perché nel be non mi serve
  roles?: string[];
  captcha?: string;
  agree?: boolean;
  favorites?: iVideoClass[];
}
