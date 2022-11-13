import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // namecheap hosting
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'noreply@birthmeal.fun',
          pass: '123456789',
        }
      },
      defaults: {
        from: '\"No Reply\" <noreply@birthmeal.fun>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
