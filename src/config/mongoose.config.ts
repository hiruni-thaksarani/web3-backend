import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'; 

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = { 
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('DB_CONNECTION_URL');
        console.log('Connected to the database');
        return { uri };
      },
      
    inject: [ConfigService], 
};