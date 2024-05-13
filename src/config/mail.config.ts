import { MailerAsyncOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const views = process.cwd()+'/src/templates/views/';
const partials = process.cwd()+'/src/templates/partials/';
export const mailerConfig: MailerAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => {
        return {
            transport: {
                service: config.get<string>('MAIL_SERVICE'),
                auth: {
                    user: config.get<string>('EMAIL'),
                    pass: config.get<string>('PASSWORD')
                }
            },
            defaults: {
                from: config.get<string>('EMAIL'),
            },
            template: {
                dir: views,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                }
            },
            options: {
                partials: {
                    dir: partials,
                    options: {
                        strict: true,
                    }
                }
            }
        }
    },
    inject: [ConfigService]
}