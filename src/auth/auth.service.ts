import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByLogin(login);
    const isMatch = await bcrypt.compare(pass, user?.password); //bcrypt hashes
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user; //remove password from result
    const payload = { sub: user.id, email: user.email };
    return {
      user: result,
      access_token: await this.jwtService.signAsync(payload),
    };

    return result;
  }
}
