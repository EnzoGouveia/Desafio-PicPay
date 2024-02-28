const User = require('../models/User');
const transport = require('../utils/mailTrap');

async function transaction(req, res){
    const { sender, receiver, value } =  req.body;

    const senderExist = await User.findOne({ cpf: sender });
    const receiverExist = await User.findOne({ cpf: receiver });
    if (!senderExist || !receiverExist) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (senderExist.balance < value) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    if (senderExist.userType === 'MERCHANT'){
        return res.status(400).json({ error: 'Lojistas não podem enviar dinheiro' });
    }

    if (receiverExist.userType === 'USER'){
        return res.status(400).json({ error: 'Usuários não podem receber dinheiro' });
    }

    try {
        const authorizationResponse = await fetch('https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc')
            .then(data => {
            return data.json();
        });
        if (authorizationResponse.message === 'Autorizado'){
            const senderNewBalance = senderExist.balance -= value;
            const receiverNewBalance = receiverExist.balance += value;

            await User.updateOne({cpf: sender}, {balance: senderNewBalance})
            await User.updateOne({cpf: receiver}, {balance: receiverNewBalance})

            try {
                const authorizationEmail = await fetch('https://run.mocky.io/v3/54dc2cf1-3add-45b5-b5a9-6bf7e7f1f4a6')
                    .then(data => {
                    return data.json();
                })
                if (authorizationEmail.message){
                    var mailOptions = {
                        from: 'equipe.picpay@example',
                        to: receiverExist.email,
                        subject: 'Transferencia concluída',
                        text: `${receiverExist.fullName} você recebeu uma transferencia de ${senderExist.fullName} no valor de R$ ${value}.`
                        };
                    transport.sendMail(mailOptions, function(error){
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }

            res.status(200).json({ message: 'Transferência realizada com sucesso' });
        } else {
            res.status(400).json({ error: 'Transferência não autorizada' });
        }
    } catch (error) {
        console.error('Erro ao consultar serviço autorizador', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    transaction
};