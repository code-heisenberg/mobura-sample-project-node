// routes/userRoutes.js
const express = require('express');
const VisaprocessController = require('../controllers/postgressql.visaprocesscontroller');
const router = express.Router();

router.get('/', VisaprocessController.findAllCandidates);
router.get('/:id', VisaprocessController.findCandidatesById);
router.post('/createCandidates', VisaprocessController.createCandidates);
router.post('/candidatesLogin', VisaprocessController.candidatesLogin);
router.post('/visaprocessUpdate/:code/:word', VisaprocessController.visaprocessUpdate);
router.post('/visaprocessDelete/:code/:word', VisaprocessController.visaprocessDelete);
// Other user routes
module.exports = router;
