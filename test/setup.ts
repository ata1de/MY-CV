import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { AppModule } from '../src/app.module';

let app: INestApplication;
const testDbFile = 'test.sqlite';

global.beforeEach(async () => {
    if (fs.existsSync(testDbFile)) {
        fs.unlinkSync(testDbFile);
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    await app.init();
});

global.afterEach(async () => {
    if (app) {
        await app.close();
    }

    if (fs.existsSync(testDbFile)) {
        fs.unlinkSync(testDbFile);
    }
});

global.getApp = () => app;
