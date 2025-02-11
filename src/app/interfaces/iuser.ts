import { iDictionary } from './i-dictionary';

export interface iUser {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email?: string; // opzionale perché nel be non mi serve
  roles?: string[];
  captcha?: string;
  agree?: boolean;
  favoritesD?: iDictionary[];
  imgUrl?: string;
  hasPaid?: boolean;
}
