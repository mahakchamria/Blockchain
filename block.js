window.onload = async function(){


    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.enable();
    }
    const web3 = new Web3(window.ethereum);

    //contract address and ABI
    const contractAddress = '0x3D874F929AeF740F4Af0CDaA0007895BF2C44b61'; // Replace with your deployed contract address
    const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_totalSupply",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
    ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    async function transferTokens(to, value) {
        try {
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];

            await contract.methods.transfer(to, value).send({ from: sender });
            console.log('Tokens transferred successfully');
        } catch (error) {
            console.error('Error transferring tokens:', error);
        }
    }

    async function getBalance(account) {
        try {
            const balance = await contract.methods.balanceOf(account).call();
            console.log('Account balance:', balance);
            return balance;
        } catch (error) {
            console.error('Error getting balance:', error);
        }
    }

    async function displayTokenDetails() {
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const totalSupply = await contract.methods.totalSupply().call();
        document.getElementById('tokenName').textContent = name;
        document.getElementById('tokenSymbol').textContent = symbol;
        document.getElementById('totalSupply').textContent = totalSupply.toString();
    }

    function listenForTransferEvents() {
        contract.events.Transfer()
            .on('data', function(event) {
                const { from, to, value } = event.returnValues;
                const eventMessage = `Transfer: ${from} -> ${to}, Value: ${value} ST`;
                displayEvent(eventMessage);
            })
            .on('error', function(error) {
                console.error('Error listening for transfer events:', error);
            });
    }

    function displayEvent(eventMessage) {
        const eventLog = document.getElementById('eventLog');
        const eventElement = document.createElement('p');
        eventElement.textContent = eventMessage;
        eventLog.appendChild(eventElement);
    }

    listenForTransferEvents();
    displayTokenDetails();

    //event listeners
    const transferBtn = document.getElementById('transferBtn');
    const balanceBtn = document.getElementById('balanceBtn');
    const balanceDisplay = document.getElementById('balanceDisplay');
    const toInput = document.getElementById('to');
    const valueInput = document.getElementById('value');
    const bal = document.getElementById('add');


    transferBtn.addEventListener('click', async () => {
        const to = toInput.value;
        const value = valueInput.value;
        await transferTokens(to, value);
    });

    balanceBtn.addEventListener('click', async () => {
        const account = bal.value;
        const balance = await getBalance(account);
        balanceDisplay.textContent = `Account balance: ${balance}`;

    });


}