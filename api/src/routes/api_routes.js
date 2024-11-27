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

router.post("/reserva", reservaController.createReservas); // http://localhost:5000/reservas/v1/reserva
router.get("/reservas", reservaController.getAllReservas); // http://localhost:5000/reservas/v1/reservas
router.put("/reserva/:id_reserva", reservaController.updateReserva); // http://localhost:5000/reservas/v1/reserva/id_reserva
router.delete("/reserva/:id_reserva", reservaController.deleteReserva); // http://localhost:5000/reservas/v1/reserva/id_reserva

module.exports = router
