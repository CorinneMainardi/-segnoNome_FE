import { iUser } from './iuser';

export interface iEvent {
  id?: number;
  title: string;
  description: string;
  eventDate: string; // Puoi cambiarlo in `Date` se preferisci
  location: string;
  availableSeats: number;
  creator?: iUser;
}
