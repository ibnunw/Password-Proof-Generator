// Simulasi Soundness Layer Integration
class SoundnessLayerSimulator {
    constructor() {
        this.proofs = new Map();
    }
    
    async generateProof(password) {
        // Simulasi proof generation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const proof = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            hash: this.hashPassword(password),
            signature: this.generateSignature(password)
        };
        
        this.proofs.set(proof.id, proof);
        return JSON.stringify(proof, null, 2);
    }
    
    async verifyProof(proofString) {
        try {
            const proof = JSON.parse(proofString);
            const storedProof = this.proofs.get(proof.id);
            
            if (!storedProof) {
                return { valid: false, error: "Proof not found" };
            }
            
            const isValid = storedProof.signature === proof.signature;
            return { valid: isValid };
        } catch (error) {
            return { valid: false, error: "Invalid proof format" };
        }
    }
    
    hashPassword(password) {
        // Simple hash simulation
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    
    generateSignature(password) {
        return btoa(password).slice(0, 10) + Date.now().toString(36);
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

const sl = new SoundnessLayerSimulator();

async function generateProof() {
    const password = document.getElementById('passwordInput').value;
    const statusDiv = document.getElementById('status');
    const proofOutput = document.getElementById('proofOutput');
    
    if (!password) {
        showStatus('Please enter a password', 'error');
        return;
    }
    
    showStatus('Generating proof...', 'loading');
    
    try {
        const proof = await sl.generateProof(password);
        proofOutput.value = proof;
        showStatus('Proof generated successfully!', 'success');
    } catch (error) {
        showStatus('Error generating proof: ' + error.message, 'error');
    }
}

async function verifyProof() {
    const proofOutput = document.getElementById('proofOutput');
    const statusDiv = document.getElementById('status');
    
    if (!proofOutput.value) {
        showStatus('No proof to verify', 'error');
        return;
    }
    
    showStatus('Verifying proof...', 'loading');
    
    try {
        const result = await sl.verifyProof(proofOutput.value);
        if (result.valid) {
            showStatus('✓ Proof verified successfully!', 'success');
        } else {
            showStatus('✗ Proof verification failed: ' + result.error, 'error');
        }
    } catch (error) {
        showStatus('Error verifying proof: ' + error.message, 'error');
    }
}

function copyProof() {
    const proofOutput = document.getElementById('proofOutput');
    proofOutput.select();
    document.execCommand('copy');
    showStatus('Proof copied to clipboard!', 'success');
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 3000);
    }
}
