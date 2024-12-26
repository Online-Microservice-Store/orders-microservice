import { Module } from '@nestjs/common';
import { Orders2Service } from './orders2.service';
import { Orders2Controller } from './orders2.controller';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  controllers: [Orders2Controller],
  providers: [Orders2Service],
  imports: [
    NatsModule
  ]
})
export class Orders2Module {}
