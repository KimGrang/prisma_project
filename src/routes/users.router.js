import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/sign-up', async (req, res, next) => {

    try {
        const { clientId, email, password, check_password, name } = req.body;
        if (!clientId) {
            const isExistUser = await prisma.users.findFirst({
                where: {
                    email,
                },
            });

            if (isExistUser) {
                return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            if (password !== check_password || password.length < 6) {
                return res.status(410).json({ message: '최소 6자 이상이며, 비밀번호 확인과 일치해야 합니다.' })
            }

            const user = await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            return res.status(201).json({ message: `${email}(${name})님 회원가입을 축하합니다.` });
        }
        else {
            const isExistUser = await prisma.users.findFirst({
                where: {
                    clientId,
                },
            });
            if (isExistUser) {
                return res.status(409).json({ message: '이미 존재하는 카카오 유저입니다.' });
            }
            const user = await prisma.users.create({
                data: {
                    clientId,
                    name,
                },
            });

            return res.status(201).json({ message: `${name}님 회원가입을 축하합니다.` });
        }



    } catch (err) {
        next(err);
    }
});

router.post('/sign-in', async (req, res, next) => {
    const { clientId, email, password } = req.body;
    if (!clientId) {
        const user = await prisma.users.findFirst({ where: { email } });
        if (!user)
            return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
        else if (!(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        const token = jwt.sign(
            {
                userId: user.userId,
            },
            'custom-secret-key',
        );

        res.cookie('authorization', `Bearer ${token}`);
        return res.status(200).json({ message: `${user.userId}로그인 성공` });
    }
    else {
        const user = await prisma.users.findFirst({ where: { clientId } });
        if (!user)
            return res.status(401).json({ message: '존재하지 않는 카카오 유저입니다.' });
        const token = jwt.sign(
            {
                userId: user.userId,
            },
            'custom-secret-key',
        );

        res.cookie('authorization', `Bearer ${token}`);
        return res.status(200).json({ message: `${user.userId}로그인 성공` });
    }

});

router.get('/users', authMiddleware, async (req, res, next) => {
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
        where: { userId: +userId },
        select: {
            userId: true,
            email: true,
            name: true,
        },
    })

    return res.status(200).json({ data: user });
});

export default router;

