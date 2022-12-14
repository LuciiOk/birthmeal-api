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
import { ResetPasswordDto, VerifyDto } from '../dtos/forgotPassword.dto';

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
        throw new BadRequestException('Las contraseñas no coinciden');
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
      throw new HttpException('Correo o contraseña incorrectos', HttpStatus.UNAUTHORIZED);
    const isMatch = await bcrypt.compare(auth.password, user.password);
    if (!isMatch)
      throw new HttpException('Correo o contraseña incorrectos', HttpStatus.UNAUTHORIZED);

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
      const tokenT = token.split(' ')[1];
      const payload = this.jwtService.verify(tokenT);
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
      throw new HttpException(
        'El correo electrónico ingresado no existe',
        HttpStatus.NOT_FOUND,
      );

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
      throw new HttpException(
        'El correo electrónico no existe',
        HttpStatus.NOT_FOUND,
      );
    if (user.code !== verify.code)
      throw new HttpException(
        'El código ingresado es incorrecto',
        HttpStatus.BAD_REQUEST,
      );
    throw new HttpException('Código correcto', HttpStatus.OK);
  }

  async resetPassword(resetPassword: ResetPasswordDto) {
    const user = await this.findOneByEmail(resetPassword.email);

    if (!user)
      throw new HttpException(
        'El correo electrónico no existe',
        HttpStatus.NOT_FOUND,
      );

    if (resetPassword.password !== resetPassword.confirmPassword)
      throw new HttpException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(resetPassword.password, salt);
    user.password = hashedPassword;
    user.code = null;
    await user.save();
  }
}
