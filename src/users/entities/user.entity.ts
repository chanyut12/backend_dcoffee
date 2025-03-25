export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: ('admin' | 'user')[];
  gender: 'male' | 'female';
}
