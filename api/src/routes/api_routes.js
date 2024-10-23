// Importar a função Router do express (Router é usado para definir rotas especificas da aplicação)
const router = require("express").Router(); //importando o módulo express

const userController = require("../controllers/userController")

router.post('/user', userController.createUser);
router.post('/login', userController.loginUser);
// router.get('/user', userController.getAllUsers);
// router.put('/user/', userController.updateUser);
// router.delete('/user/:id', userController.deleteUser);

module.exports = router // Chamando o módulo para a rota
//Exportação da instância de express configurada, para que seja acessada em outros arquivos
