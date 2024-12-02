const router = require("express").Router(); 

const salasController = require("../controllers/salasController");
const userController = require("../controllers/userController")
const reservaController = require("../controllers/reservaController");

router.post('/user', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/user', userController.getAllUsers);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

router.post("/salas", salasController.createSala);
router.get("/salas", salasController.getAllSalas);
router.put("/salas", salasController.updateSala);
router.delete("/salas/:id", salasController.deleteSala);

router.post('/agendamento', reservaController.createAgend);
router.get('/agendamento', reservaController.getAllAgend);
router.put('/agendamento', reservaController.updateAgend);
router.delete('/agendamento/:id', reservaController.deleteAgend);

module.exports = router
