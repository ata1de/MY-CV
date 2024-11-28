import { INestApplication } from '@nestjs/common';

import request from 'supertest';

describe('Auth E2E', () => {
    let app: INestApplication;

    beforeEach(() => {
        app = global.getApp();
    });

    it('should be able to singUp --> /auth/signup', async () => {
        const email = 'teste3@email.com';

        const result = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: '1234', name: 'Teste3' });

        expect(result.body.user.email).toEqual(email);
        expect(result.body.message).toEqual('User created successfully');
        expect(result.status).toEqual(201);
    });

    it('should be able to signIn --> /auth/signin', async () => {
        const email = 'test@email.com';

        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: '1234', name: 'Teste' })
            .expect(201);

        const { body } = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email, password: '1234' })
            .expect(201);

        expect(body.user.email).toEqual(email);
        expect(body.message).toEqual('User signed in successfully');
    });

    // it('should be able to get the current user --> /auth/whoami', async () => {
    //     const email = 'test@email.com';

    //     const singUpResponse = await request(app.getHttpServer())
    //         .post('/auth/signup')
    //         .send({ email, password: '1234', name: 'Teste' })
    //         .expect(201);

    //     const cookie = singUpResponse.get('Set-Cookie');

    //     const { body } = await request(app.getHttpServer())
    //         .get('/auth/whoami')
    //         .set('Cookie', cookie)
    //         .expect(200);

    //     expect(body.email).toEqual(email);
    // });
});
