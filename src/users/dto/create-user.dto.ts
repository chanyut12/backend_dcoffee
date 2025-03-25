export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  roles: ('admin' | 'user')[];
  gender: 'male' | 'female';
}
