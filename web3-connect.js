function initWeb3Connect() {
    const connectBtns = document.querySelectorAll('.btn-connect-wallet');
    if (!connectBtns.length) return;

    const toast = document.getElementById('web3-toast');

    // Helper: Format wallet address (e.g. 0x1234...5678)
    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Helper: Update Button UI State
    const updateUI = (address) => {
        connectBtns.forEach(btn => {
            const textSpan = btn.querySelector('.wallet-text');
            if (textSpan) {
                textSpan.textContent = address ? formatAddress(address) : "Connect Metamask";
            }
            if (address) {
                // Connected State: Purple Outline
                btn.classList.add('bg-surface2', 'border-primary', 'shadow-primary/25', 'text-white');
                btn.classList.remove('bg-primary', 'border-primary/30', 'hover:bg-primaryHover');
                btn.classList.add('hover:bg-primary/20');
            } else {
                // Disconnected State: Default button
                btn.classList.remove('bg-surface2', 'border-primary', 'shadow-primary/25', 'hover:bg-primary/20');
                btn.classList.add('bg-primary', 'border-primary/30', 'hover:bg-primaryHover');
            }
        });
    };

    // 1. Check existing connection on load
    const savedAddress = localStorage.getItem('connected_wallet');
    if (savedAddress) {
        updateUI(savedAddress);
    }

    // 2. Connect logic
    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request accounts from Metamask
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                
                // Save state
                localStorage.setItem('connected_wallet', address);
                updateUI(address);
                
                // Show Success Toast
                if (toast) {
                    toast.classList.remove('translate-x-[150%]', 'opacity-0');
                    setTimeout(() => {
                        toast.classList.add('translate-x-[150%]', 'opacity-0');
                    }, 5000);
                }
            } catch (error) {
                console.error("User rejected request or error occurred:", error);
            }
        } else {
            // No Metamask installed
            alert("Ekstensi MetaMask tidak ditemukan! Harap install MetaMask di browser Anda terlebih dahulu.");
            window.open("https://metamask.io/download/", "_blank");
        }
    };

    // 3. Attach click event listener to all connect buttons
    connectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            connectWallet();
        });
    });

    // 4. Listen to account changes from Metamask
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                localStorage.setItem('connected_wallet', accounts[0]);
                updateUI(accounts[0]);
            } else {
                // User disconnected their wallet
                localStorage.removeItem('connected_wallet');
                updateUI(null);
            }
        });
    }
}

// Automatically run on load
initWeb3Connect();
