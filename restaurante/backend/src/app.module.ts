// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MesasModule } from './mesas/mesas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [
    // 1. Cargar el .env globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configurar TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Lee del .env
        autoLoadEntities: true, // Carga todas las @Entity
        synchronize: true, // Sincroniza la BD (¡Solo para desarrollo!)
      }),
    }),

    // 3. Importar los módulos de la aplicación
    MesasModule,
    ClientesModule,
    ReservasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}