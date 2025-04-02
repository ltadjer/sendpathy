import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

const authenticate = async (email: string, password: string, userService: UserService) => {
  const user = await userService.findOneByEmail(email);

  if (user && await bcrypt.compare(password, user.password) && user.role === 'THERAPIST') {
    return user;
  }

  return null;
};

const prisma = new PrismaService();

@Module({
  imports: [
    UserModule,
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [UserModule],
        useFactory: async (userService: UserService) => {
          const { Database, Resource, getModelByName } = await import('@adminjs/prisma');
          const AdminJS = (await import('adminjs')).default;

          AdminJS.registerAdapter({ Database, Resource });

          return {
            adminJsOptions: {
              rootPath: '/admin',
              branding: {
                companyName: 'Sendpathy',
                logo: '../../assets/logo.svg',
              },
              resources: [
                {
                  resource: { model: getModelByName('User'), client: prisma },
                  options: {}
                },
                {
                  resource: { model: getModelByName('Reservation'), client: prisma },
                  options: {}
                },
                {
                  resource: { model: getModelByName('AvailableSlot'), client: prisma },
                  options: {}
                },
              ],
            },
            auth: {
              authenticate: (email: string, password: string) => authenticate(email, password, userService),
              cookieName: 'adminjs',
              cookiePassword: 'secret',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          };
        },
        inject: [UserService],
      })
    ),
  ],
})
export class AdminModule {}