import { ethers } from 'ethers';
import { Log } from 'ethers';
import db from './db';
import { UserOperationEvent } from './types';

// Fonction pour insérer un événement dans la base SQLite
export async function saveEventToDB(
    event: UserOperationEvent, 
    blockNumber: number, 
    timestamp: number
) {
    try {
        return new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT INTO UserOperationEvent (
                    userOpHash, sender, paymaster, nonce, success, 
                    actualGasCost, actualGasUsed, blockNumber, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    event.userOpHash,
                    event.sender,
                    event.paymaster,
                    event.nonce.toString(),
                    event.success ? 1 : 0,
                    event.actualGasCost.toString(),
                    event.actualGasUsed.toString(),
                    blockNumber,
                    timestamp
                ],
                (err) => {
                    if (err) {
                        console.error('Error saving event to DB:', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error in saveEventToDB:', error);
        throw error;
    }
}

// Décoder les logs Ethereum
export function decodeUserOperationEvent(log: Log, abi: string[]): UserOperationEvent {
    try {
        const iface = new ethers.Interface(abi);
        const parsedLog = iface.parseLog(log);

        if (!parsedLog) {
            throw new Error('Failed to parse log');
        }

        return {
            userOpHash: parsedLog.args.userOpHash as string,
            sender: parsedLog.args.sender as string,
            paymaster: parsedLog.args.paymaster as string,
            nonce: BigInt(parsedLog.args.nonce.toString()),
            success: parsedLog.args.success as boolean,
            actualGasCost: BigInt(parsedLog.args.actualGasCost.toString()),
            actualGasUsed: BigInt(parsedLog.args.actualGasUsed.toString()),
            blockNumber: parsedLog.args.blockNumber as number,
            timestamp: parsedLog.args.timestamp as number,
        };
    } catch (error) {
        console.error('Error decoding UserOperation event:', error);
        throw error;
    }
}