export interface Patient {
  name?: string;
  email?: string;
  birthDate?: string;
  codLogin?: string;
  diagnosisDate?: string;
  otherComorbidities?: string;
  createdAt?: Date;
  responsible?: string;
  age?: number;
  therapyTime?: string;
  birthDateFormatted?: string;
  diagnosisDateFormatted?: string;
}
export default Patient;
