import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/user.service.js';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import { Components } from './components.js';


const assetsPath = path.join(__dirname, '..', '..', '..', 'assets');
console.log(`assetsPath: ${assetsPath}`);


const authenticateUser = async (email: string, password: string, userService: UserService) => {
  const user = await userService.findOneByEmail(email);

  if (user && await bcrypt.compare(password, user.password)) {
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

          const adminJsOptions = {
            rootPath: '/admin',
            branding: {
              companyName: 'Sendpathy',
              logo: `${assetsPath}/logo.svg`,
            },
            assets: {
              styles: [`${assetsPath}/admin.css`],
            },
            locale: {
              language: 'fr',
              availableLanguages: ['en', 'fr'],
              localeDetection: true,
              translations: {
                fr: {
                  messages: {
                    welcomeOnBoard_title: 'Bienvenue sur Sendpathy',
                  },
                  actions: {
                    new: 'Ajouter',
                    edit: 'Éditer',
                    show: 'Afficher',
                    delete: 'Supprimer',
                    list: 'Liste',
                  },
                  buttons: {
                    save: 'Enregistrer',
                    filter: 'Filtrer',
                    resetFilter: 'Réinitialiser le filtre',
                    applyChanges: 'Appliquer',
                  },
                  properties: {
                    name: 'Nom',
                    email: 'Email',
                    password: 'Mot de passe',
                    DeletedAt: 'Supprimé le',
                    CreatedAt: 'Créé le',
                    UpdatedAt: 'Mis à jour le',
                  },
                  labels: {
                    Comment: 'Commentaire',
                    Reservation: 'Réservation',
                    Post: 'Publication',
                    Tag: 'Tag',
                    Trigger: 'Trigger',
                    User: 'Utilisateur',
                    AvailableSlot: 'Créneaux disponibles',
                    Message: 'Message',
                    Conversation: 'Conversation',
                  },
                  resources: {
                    Comment: {
                      properties: {
                        content: 'Contenu',
                      },
                      actions: {
                        new: 'Ajouter un commentaire',
                      },
                    },
                  },
                },
              },
            },
            resources: [
              {
                resource: { model: getModelByName('User'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                    password: { isVisible: false},
                    refreshToken: { isVisible: false },
                    accessToken: { isVisible: false },
                    resetPasswordToken: { isVisible: false },
                    codeAccess: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'ADMIN' || currentAdmin.role === 'THERAPIST'),
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Reservation'), client: prisma },
                options: {
                  navigation: '',
                  properties: {
                    id: { isVisible: false },
                    slotId: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'THERAPIST',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'THERAPIST',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'THERAPIST',
                    },
                    list: {
                      component: Components.ReservationCalendar,
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('AvailableSlot'), client: prisma },
                options: {
                  navigation: '',
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'THERAPIST',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'THERAPIST',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'THERAPIST',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'ADMIN' || currentAdmin.role === 'THERAPIST'),
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Post'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                    comments: {
                      type: 'mixed',
                      isVisible: { list: true, filter: false, show: true, edit: false },
                      components: {
                        show: Components.CommentsShow,
                      },
                    },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    show: {
                      before: async (request, context) => {
                        const { record } = context;
                        if (record && record.params.id) {
                          const postWithComments = await prisma.post.findUnique({
                            where: { id: record.params.id },
                            include: { comments: true },
                          });
                          record.params.comments = postWithComments.comments;
                          console.log('Post with comments:', postWithComments);
                        }
                        return request;
                      },
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Tag'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Trigger'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Comment'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Message'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Conversation'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Friendship'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
              {
                resource: { model: getModelByName('Report'), client: prisma },
                options: {
                  navigation: null,
                  properties: {
                    id: { isVisible: false },
                  },
                  actions: {
                    new: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    edit: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    delete: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                    list: {
                      isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'ADMIN',
                    },
                  },
                },
              },
            ]
          };
          return {
            adminJsOptions,
            auth: {
              authenticate: (email: string, password: string) => authenticateUser(email, password, userService),
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