export class User {
  id: number;
  login: string;
  password: string;
  roles: ('admin' | 'user')[];
  gender: 'male' | 'female';
  age: number;
}
