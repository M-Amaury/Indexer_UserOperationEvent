export interface UserOperationEvent {
    userOpHash: string;     
    sender: string;         
    paymaster: string;      
    nonce: bigint;         
    success: boolean;      
    actualGasCost: bigint; 
    actualGasUsed: bigint; 
    blockNumber: number;    
    timestamp: number;     
} 