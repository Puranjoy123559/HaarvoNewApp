import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MastersModule } from './modules/masters/masters.module';
import { OrganisationsModule } from './modules/organisations/organisations.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PilotModule } from './modules/pilot/pilot.module';

@Module({
  imports: [
    // Loads the .env file and makes its values available everywhere.
    // Like IConfiguration reading appsettings.json in .NET.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connects to PostgreSQL using values from the .env file.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        // Automatically finds all our entity classes — no need to list them.
        autoLoadEntities: true,

        // DEV ONLY: auto-creates/updates tables from entities (like EF auto-migrate).
        // In production we will turn this OFF and use migrations instead.
        synchronize: true,

        // Converts entity property names (createdOn) to DB columns (created_on).
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    MastersModule,
    OrganisationsModule,
    UsersModule,
    AuthModule,
    PilotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
