import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthDTO, LoginDTO } from '../dtos/auth.dto';
import { Auth, Role } from '../schemas/auth.schema';
import { PayloadToken } from '../models/Payload.model';
import { CreateAdminDTO } from '../dtos/CreateAdminDto';
import { MailService } from 'src/mail/mail.service';
import { VerifyDto } from '../dtos/forgotPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async findOne(id: string): Promise<Auth> {
    const authUser = await this.authModel.findById(id).exec();
    return authUser.populate('user');
  }

  async findOneByEmail(email: string): Promise<Auth> {
    const authUser = await this.authModel.findOne({ email }).exec();
    return authUser?.populate('user');
  }

  async create(auth: AuthDTO): Promise<Auth> {
    try {
      if (auth.password !== auth.confirmPassword)
        throw new BadRequestException('Passwords do not match');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(auth.password, salt);
      const result = await this.authModel.create({
        ...auth,
        password: hashedPassword,
      });

      return result.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createAdmin(newadmin: CreateAdminDTO): Promise<Auth> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newadmin.password, salt);
      const result = await this.authModel.create({
        ...newadmin,
        password: hashedPassword,
        role: Role.ADMIN,
      });
      return result.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(auth: LoginDTO) {
    const user = await this.findOneByEmail(auth.email);
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    const isMatch = await bcrypt.compare(auth.password, user.password);
    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    return user;
  }

  async generateJWT(user: Auth) {
    try {
      const payload: PayloadToken = {
        sub: user._id,
        role: user.role,
        userID: user.user?._id || null,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyToken(token: string): Promise<PayloadToken> {
    try {
      const payload = this.jwtService.verify(token);
      if (!payload)
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      return payload;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user)
      throw new HttpException('El correo no existe', HttpStatus.NOT_FOUND);

    // generate code with 4 digits
    const code = Math.floor(1000 + Math.random() * 9000);

    // send email with code
    await this.mailService.sendEmail(
      email,
      'Código de recuperación',
      code.toString(),
    );
    // save code in user
    user.code = code.toString();
    await user.save();
  }

  async verifyCode(verify: VerifyDto) {
    const user = await this.findOneByEmail(verify.email);
    if (!user)
      throw new HttpException('El correo no existe', HttpStatus.NOT_FOUND);
    if (user.code !== verify.code)
      throw new HttpException('Código incorrecto', HttpStatus.BAD_REQUEST);
    throw new HttpException('Código correcto', HttpStatus.OK);
  }
}
