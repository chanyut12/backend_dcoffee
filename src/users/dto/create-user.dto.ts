export class CreateUserDto {
  login: string;
  password: string;
  roles: ('admin' | 'user')[];
  gender: 'male' | 'female';
  age: number;
}
