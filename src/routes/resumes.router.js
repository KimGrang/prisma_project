import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/resumes', authMiddleware, async (req, res, next) => {
    const { userId, name } = req.user;
    const { title, content } = req.body;

    try {
        const resume = await prisma.resumes.create({
            data: {
                userId: +userId,
                title,
                content,
                auth: name
            },
        });

        return res.status(201).json({ data: resume });
    } catch (error) {
        return next(error);
    }
});

router.get('/resumes', async (req, res, next) => {
    try {
        const { orderKey, orderValue } = req.body;

        if (!orderKey || !orderValue) {
            return res.status(400).json({
                success: false,
                message: 'orderKey 또는 orderValue가 제공되지 않았습니다.'
            });
        }

        if (!['resumeId', 'status'].includes(orderKey)) {
            return res.status(400).json({
                success: false,
                message: 'orderKey가 올바르지 않습니다.'
            });
        }

        if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'orderValue가 올바르지 않습니다.'
            });
        }

        const resumes = await prisma.resumes.findMany({
            orderBy: {
                [orderKey]: orderValue,
            },
            select: {
                resumeId: true,
                title: true,
                content: true,
                auth: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                userId: true
            },
        });

        return res.status(200).json({ data: resumes });
    } catch (error) {
        console.error('이력서를 가져오는 중 오류 발생:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
});

router.get('/resumes/:resumeId', async (req, res, next) => {
    const { resumeId } = req.params;
    const resume = await prisma.resumes.findFirst({
        where: {
            resumeId: +resumeId,
        },
        select: {
            resumeId: true,
            userId: true,
            title: true,
            content: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return res.status(200).json({ data: resume });
});

router.patch('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
    try {
        const { resumeId } = req.params;
        const { userId } = req.user;

        const existingResume = await prisma.resumes.findFirst({
            where: {
                resumeId: +resumeId,
                userId: +userId,
            }
        });
        if (!existingResume) {
            return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });
        }

        const { title, content, status } = req.body;
        const updatedResume = await prisma.resumes.update({
            where: {
                resumeId: +resumeId
            },
            data: {
                title: title ? title : existingResume.title,
                content: content ? content : existingResume.content,
                status: status ? status : existingResume.status
            }
        });

        return res.status(200).json({ data: updatedResume });
    } catch (error) {
        console.error('Error updating resume:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
});

router.delete('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
    try {
        const { resumeId } = req.params;
        const { userId } = req.user;

        const existingResume = await prisma.resumes.findFirst({
            where: {
                resumeId: +resumeId,
                userId: +userId,
            }
        });

        if (!existingResume) {
            return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
        }

        await prisma.resumes.delete({
            where: {
                resumeId: +resumeId
            }
        });

        return res.status(200).json({ message: "이력서 삭제 완료" });
    } catch (error) {
        console.error('이력서를 삭제하는 중 오류 발생:', error);
        return res.status(500).json({ message: '내부 서버 오류' });
    }
});

export default router;