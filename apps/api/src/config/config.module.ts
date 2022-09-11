import {Module} from '@nestjs/common';
import {ConfigResolver} from './config.resolver';
import {CommonModule} from '../common/common.module';
import {DatabaseModule} from '../database/database.module';
import {ConfigDataloaderService} from './config.dataloader';

@Module({
  imports: [CommonModule, DatabaseModule],
  providers: [ConfigResolver, ConfigDataloaderService],
})
export class ConfigModule {}
