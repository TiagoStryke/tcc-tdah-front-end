export interface User {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  generatedCode?: string[];
  profilePhoto?: string;
  privilege?: string;
}
