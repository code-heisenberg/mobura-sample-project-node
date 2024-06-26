// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const CandidatesController = require('../controllers/postgressql.candidatescontroller');

router.get('/', CandidatesController.findAllCandidates);
router.get('/:id', CandidatesController.findCandidatesById);
router.post('/createCandidates', CandidatesController.createCandidates);
router.post('/candidatesLogin', CandidatesController.candidatesLogin);
router.post('/candidatesUpdate/:code/:id', CandidatesController.candidatesUpdate);
router.post('/candidatesDelete/:code', CandidatesController.candidatesDelete);
// Other user routes
module.exports = router;
