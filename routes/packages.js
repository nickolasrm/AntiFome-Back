const express = require('express')
const packages = require('../controllers/packages')
const passport = require('../config/passport')
const contents = require('../controllers/contents')

const router = express.Router()

router.get('/packages', packages.index)
router.get('/packages/institution', packages.index_institution)
router.get('/packages/content', contents.index_by_package)
router.get('/packages/content/institution', contents.index_by_package_institution)
router.post('/packages', packages.store)
router.delete('/packages', packages.delete)
router.delete('/packages/content', contents.delete)

module.exports = router