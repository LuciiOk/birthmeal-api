import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { CategoriesController } from './controllers/categories/categories.controller';
import { CompaniesController } from './controllers/companies/companies.controller';
import { ValorationController } from './controllers/valoration/valoration.controller';
import { CategoriesService } from './services/categories/categories.service';
import { CompaniesService } from './services/companies/companies.service';
import { ValorationService } from './services/valoration/valoration.service';
import { Company, CompanySchema } from './schemas/companies.schema';
import { Category, CategorySchema } from './schemas/categories.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [
    CategoriesController,
    CompaniesController,
    ValorationController,
  ],
  providers: [CategoriesService, CompaniesService, ValorationService],
  exports: [CompaniesService, CategoriesService],
})
export class CompaniesModule {}
