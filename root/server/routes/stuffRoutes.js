const router = require("express").Router();
const stuffCtrl = require("../controllers/stuffCtrl");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllStuff);

module.exports = router;