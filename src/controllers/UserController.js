const User = require('../models/User')

async function registerUser(req, res){
    const { fullName, cpf, email, password, userType, balance} =  req.body;
    let userExists;

    (cpf) ? userExists = await User.findOne({ cpf: cpf }) : userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const user = new User ({
        fullName,
        cpf,
        email,
        password,
        userType,
        balance
    });
    
    try {
        await user.save()

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }

}

async function getUsers(req, res){
    var userMap = {}
    for await (const user of User.find()){
        userMap[user._id] = user;
    }
    return res.status(200).json(userMap);
}

async function findUser(req, res){
    const { cpf, email } = req.body;
    let userExists;

    (cpf) ? userExists = await User.findOne({ cpf: cpf }) : userExists = await User.findOne({ email: email });

    if (userExists){
        res.status(200).json(userExists);
    }else {
        return res.status(400).json({ error: 'Usuário não existente' });
    }
}

async function updateUser(req, res){
    const { fullName, cpf, email, password, balance} =  req.body;
    let userExists;

    (cpf) ? userExists = await User.findOne({ cpf: cpf }) : userExists = await User.findOne({ email: email });
    
    if (userExists){
        try {
            await User.updateMany({cpf: userExists.cpf } , { $set: {fullName: fullName, password: password, balance: balance} });

            res.status(200).json({ message: 'Atualização realizada com sucesso' });
        }catch(error) {
            console.error('Erro ao atualizar os dados do usuário', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }else {
        return res.status(400).json({ error: 'Usuário não existente' });
    }

}

async function deleteUser(req, res){
    const { cpf, email } = req.body;
    let userExists;

    (cpf) ? userExists = await User.findOne({ cpf: cpf }) : userExists = await User.findOne({ email: email });
    
    if (userExists){
        try {
            await User.deleteOne({cpf: userExists.cpf});

            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        }catch(error) {
            console.error('Erro ao atualizar os dados do usuário', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }else {
        return res.status(400).json({ error: 'Usuário não existente' });
    }
}

module.exports = {
    getUsers,
    findUser,
    registerUser,
    updateUser,
    deleteUser
};
