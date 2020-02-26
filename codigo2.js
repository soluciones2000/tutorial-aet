module.exports = function() {

	const fs = require('fs');
	const { Universal: Ae, MemoryAccount, Node } = require('@aeternity/aepp-SDK');

	main = async (name) => {
		// function to log any errors
		logError = (error) => console.error(error)

		// function to decode errors from contract calling
		decodeError = async (error) => {
		    // results from the node need to be decoded to be human readable
		    decodedError = await client.contractDecodeData('string', error.returnValue).catch(logError);
		    console.error('error:', decodedError.value);
		}

		node = await Node({ url: 'https://sdk-testnet.aepps.com', internalUrl: 'https://sdk-testnet.aepps.com' });
		acc = MemoryAccount({ keypair: {
			publicKey: 'ak_TQM7iGyV793WEpnXqA2Brs5SwpTEvhEKRtcGncTKp78mzhKDo',
			secretKey: 'fed429dbc1ca06d15bc65a23a04b161a5398d448aa7a20bf5b0bc1820489557a3bf33ed53e9cda6be3b4f9a6ff5abd5d7de52287042a39ee1d16e01c444b9d31'
		} });
		client = await Ae({
			nodes: [
				{ name: 'testNet', instance: node },
			],
			compilerUrl: 'https://compiler.aepps.com',
			accounts: [acc],
			address: 'ak_TQM7iGyV793WEpnXqA2Brs5SwpTEvhEKRtcGncTKp78mzhKDo'
		});

		// contractSource = fs.readFileSync('./ContractCards.aes', 'utf-8');
		contractSource = `
contract Card =

  record card = {
     card   : string,
     nombre : string,
     saldo  : int }

  record state = {
    cards : map(string, card) }

  entrypoint init() = { cards = {} }

  stateful entrypoint recarga_inicial( card' : string, nombre' : string, monto : int ) =
    let card = { card = card', nombre = nombre', saldo = monto }
    put(state {cards[card'] = card})

  entrypoint busca_tarjeta(card' : string) : card =
    state.cards[card']

  stateful entrypoint recarga( card' : string, monto : int ) =
    let card = busca_tarjeta( card')
    let nuevoSaldo = card.saldo + monto
    let cardActualizada = state.cards{ [card'].saldo = nuevoSaldo }
    put(state {cards = cardActualizada})

  stateful entrypoint consumo( card' : string, monto : int ) =
    let card = busca_tarjeta( card')
    let nuevoSaldo = card.saldo - monto
    if(nuevoSaldo < 0)
      abort("Saldo insuficiente")
    else
      let cardActualizada = state.cards{ [card'].saldo = nuevoSaldo }
      put(state {cards = cardActualizada})
		`;

		contract = await client.getContractInstance(contractSource);
		console.log(contract);

		console.log('Dirección del contrato en la blockchain (testnet)');

		deployed = await contract.deploy();
		console.log(deployed.address);
		// console.log(contract.deployInfo);

		console.log('Recarga inicial:');

		calledSet = await contract.call('recarga_inicial', ['1234', 'Luis', 100], 0).catch(e => console.error(e));
		// console.log(calledSet);
		console.log(calledSet.decodedResult);
		calledGet = await contract.call('busca_tarjeta', ['1234'], 0).catch(e => console.error(e));
		// console.log(calledGet);
		console.log(calledGet.decodedResult);

		console.log('Otra recarga, esta vez de 500:');

		calledRec = await contract.call('recarga', ['1234',500], 0).catch(e => console.error(e));
		// console.log(calledRec);
		console.log(calledRec.decodedResult);
		calledGe2 = await contract.call('busca_tarjeta', ['1234'], 0).catch(e => console.error(e));
		// console.log(calledGet);
		console.log(calledGe2.decodedResult);

		console.log('Consumo de 400:');

		calledPay = await contract.call('consumo', ['1234', 400], 0).catch(e => console.error(e));
		// console.log(calledPay);
		console.log(calledPay.decodedResult);
		calledPa2 = await contract.call('busca_tarjeta', ['1234'], 0).catch(e => console.error(e));
		// console.log(calledGet);
		console.log(calledPa2.decodedResult);
	}

	main();

}
require('./codigo2.js')()