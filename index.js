const fs = require('fs');
const {Universal} = require('@aeternity/aepp-sdk');

// function to hold all our example code
const main = async (name) => {
	// function to log any errors
	const logError = (error) => console.error(error);

	// function to decode errors from contract calling
	const decodeError = async (error) => {

	    // results from the node need to be decoded to be human readable
	    const decodedError = await client.contractDecodeData('string', error.returnValue).catch(logError);
	    console.error('error:', decodedError.value);
	};

	// initialize aeternity sdk client
	const client = await Universal({
	    url: 'https://sdk-testnet.aepps.com', //replace with https://sdk-mainnet.aepps.com for mainnet
	    internalUrl: 'https://sdk-testnet.aepps.com', //replace with https://sdk-mainnet.aepps.com for mainnet
	    compilerUrl: 'https://compiler.aepps.com',
	    // address: 'ak_TQM7iGyV793WEpnXqA2Brs5SwpTEvhEKRtcGncTKp78mzhKDo',
	    keypair: {
	        publicKey: 'ak_TQM7iGyV793WEpnXqA2Brs5SwpTEvhEKRtcGncTKp78mzhKDo',
	        secretKey: 'fed429dbc1ca06d15bc65a23a04b161a5398d448aa7a20bf5b0bc1820489557a3bf33ed53e9cda6be3b4f9a6ff5abd5d7de52287042a39ee1d16e01c444b9d31'
	        // secretKey: 'ed25519'
	    },
	    networkId: 'ae_uat', //replace with ae_mainnet for mainnet
	    nativeMode: true
	});
// console.log(client);

	// read the ExampleContract.aes from same directory
	const contract = fs.readFileSync('./ExampleContract.aes', 'utf-8');

	// use the client to compile the contract code, catching eventual errors
	const compiled = await client.contractCompile(contract).catch(logError);

	// logging the bytecode output to the console to see the code work
	console.log('contract bytecode:', compiled.bytecode);

	// use the client to deploy the contract bytecode to the blockchain, catching eventual errors
	// we have to pass the initState where we choose 10000 as the number of available count and 15 as minimum price per item
	const deployed = await client.contractDeploy(compiled.bytecode, 'sophia', {initState: '(10000, 15)'}).catch(logError);
	// const deployed = await client.contractDeploy(compiled.bytecode, contract, {initState: '(10000, 15)'}).catch(logError);


	// logging the contract address to the console, this is later used to call function of the contract
	console.log('deployed contract address:', deployed.address);
/*
	// call the contract 'reserve' function using the deployed address, 'sophia-address' is used to indicate we are calling using the address
	// then we pass the arguments '(200)' as count that we want to reserve and as option the amount of tokens that should be added to the contract call
	// in our case 200 (the count) times 15 (the minimum price set)
	const calledReserve = await client.contractCall(deployed.address, 'sophia-address', deployed.address, 'reserve', {
	    args: '(200)',
	    options: {amount: 200 * 15}
	}).catch(decodeError);

	// we log if the contract call was successful, in this case if the success response is defined
	console.log('reservation successful:', !!calledReserve);

	// call the 'available_count' function without any arguments, so '()' is used
	const calledAvailableCount = await client.contractCallStatic(deployed.address, 'sophia-address', 'available_count', {args: '()'}).catch(logError);

	// log the bytecode result to the console
	console.log('available count bytecode:', calledAvailableCount.result);

	// decode the result as 'int' datatype
	const decodedAvailableCount = await client.contractDecodeData('int', calledAvailableCount.result).catch(logError);

	// show the available_count output on the console as int
	console.log('available count decoded:', decodedAvailableCount.value);

	// call the 'owner_withdraw' function without any arguments, so '()' is used, catch any possible errors
	const calledWithdraw = await client.contractCall(deployed.address, 'sophia-address', deployed.address, 'owner_withdraw', {args: '()'}).catch(decodeError);

	// log the bytecode result to the console
	console.log('withdraw amount bytecode:', calledAvailableCount.result);

	// decode the result as 'int' datatype
	const decodedWithdraw = await client.contractDecodeData('int', calledWithdraw.result.returnValue).catch(logError);

	// show the withdraw amount output on the console as int
	console.log('withdraw amount decoded:', decodedWithdraw.value);*/
};

main();