const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const { applyToProject, getApplications, listApplicants } = require('../controllers/applicationController');

router.post('/', authenticate, requireRole('freelancer'), applyToProject); // フリーランスのみ応募可能
router.get('/', authenticate, getApplications); // 全ユーザーが自身の応募履歴を取得可能
router.get('/:projectId/applicants', authenticate, requireRole('client'), listApplicants); // クライアント用の応募者一覧取得

module.exports = router;