import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { decodeUserOperationEvent, saveEventToDB } from './eventHandler';

dotenv.config();

const wsUrl = process.env.WS_URL;
if (!wsUrl) throw new Error('WS_URL non défini dans .env');

const entryPointAddress = "0x0000000071727de22e5e9d8baf0edac6f37da032";
const userOperationEventTopic = "0x49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f";
const provider = new ethers.WebSocketProvider(wsUrl);

const abi = [
    "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)"
];

// Écoute des événements en temps réel
provider.on(
    {
        address: entryPointAddress,
        topics: [userOperationEventTopic],
    },
    async (log) => {
        try {
            const decodedEvent = decodeUserOperationEvent(log, abi); 
            const block = await provider.getBlock(log.blockNumber);
            if (!block) {
                throw new Error(`Block ${log.blockNumber} not found`);
            }
            
            await saveEventToDB(
                decodedEvent, 
                log.blockNumber, 
                block.timestamp
            );
            console.log('Événement sauvegardé :', decodedEvent);
        } catch (error) {
            console.error('Erreur lors du traitement de l\'événement :', error);
        }
    }
);