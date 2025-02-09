export interface iLessonInterest {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  lessonType: 'ONLINE' | 'IN_PERSON';
  preferredDays: string;
  preferredTimes: string;
  city?: string; // Opzionale, solo se la lezione è in presenza
  contacted?: boolean; // Solo il creator può modificarla
  interested?: boolean; // Solo il creator può modificarla
  toBeRecontacted?: boolean; // Solo il creator può modificarla
  note?: string; // Solo il creator può modificarla
  handled?: boolean; // Solo il creator può modificarla
}
