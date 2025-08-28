import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "https://cdn.jsdelivr.net/npm/@solana/web3.js@1.98.4/+esm";
import { PhantomWalletAdapter } from "https://cdn.jsdelivr.net/npm/@solana/wallet-adapter-phantom@0.9.28/+esm";
import { SolflareWalletAdapter } from "https://cdn.jsdelivr.net/npm/@solana/wallet-adapter-solflare@0.6.32/+esm";

// عناصر HTML
const connectPhantomBtn = document.getElementById("connectPhantom");
const connectSolflareBtn = document.getElementById("connectSolflare");
const disconnectBtn = document.getElementById("disconnectWallet");
const switchBtn = document.getElementById("switchNetwork");
const walletAddressEl = document.getElementById("walletAddress");
const buyNowBtn = document.getElementById("buyNow");
const amountInput = document.getElementById("amountInput");
const usdValueEl = document.getElementById("usdValue");
const networkInfoEl = document.getElementById("networkInfo");

let wallet = null;
let connected = false;
let currentNetwork = "devnet";
let connection = new Connection(clusterApiUrl(currentNetwork), "confirmed");

// سعر FREP بالدولار
const FREP_PRICE = 0.001;

// تحديث قيمة الدولار
amountInput.addEventListener("input", () => {
  const amount = parseFloat(amountInput.value) || 0;
  usdValueEl.textContent = `القيمة بالدولار: $${(amount * FREP_PRICE).toFixed(4)}`;
});

// إعداد المحافظ
const wallets = {
  phantom: new PhantomWalletAdapter(),
  solflare: new SolflareWalletAdapter(),
};

// توصيل المحفظة
async function connectWallet(type) {
  if (!wallets[type]) return alert("المحفظة غير مدعومة");
  wallet = wallets[type];
  await wallet.connect();
  connected = true;
  walletAddressEl.textContent = `العنوان: ${wallet.publicKey.toBase58().slice(0,6)}...${wallet.publicKey.toBase58().slice(-4)}`;
  connectPhantomBtn.disabled = true;
  connectSolflareBtn.disabled = true;
  disconnectBtn.disabled = false;
  switchBtn.disabled = false;
  buyNowBtn.disabled = false;
}

// فصل المحفظة
async function disconnectWallet() {
  for (let key in wallets) await wallets[key].disconnect();
  connected = false;
  walletAddressEl.textContent = "";
  connectPhantomBtn.disabled = false;
  connectSolflareBtn.disabled = false;
  disconnectBtn.disabled = true;
  switchBtn.disabled = true;
  buyNowBtn.disabled = true;
}

// تبديل الشبكة
async function switchNetwork() {
  const choice = prompt("اختر الشبكة: mainnet-beta / devnet / testnet");
  if (!choice) return;
  currentNetwork = choice;
  connection = new Connection(clusterApiUrl(currentNetwork), "confirmed");
  networkInfoEl.textContent = `الشبكة: ${currentNetwork}`;
  buyNowBtn.disabled = currentNetwork !== "devnet";
}

// تنفيذ عملية الشراء
async function buyNow() {
  if (!connected) return alert("اتصل بالمحفظة أولاً");
  if (currentNetwork !== "devnet") return alert("جرّب على شبكة Devnet فقط الآن");

  const amount = parseFloat(amountInput.value);
  if (!amount || amount <= 0) return alert("أدخل كمية صالحة");

  const lamports = amount * FREP_PRICE * LAMPORTS_PER_SOL;
  const treasury = new PublicKey("G14KXQj3V5gcPgVMS4MQHaGYxuPhCVfVtf7wHJ7yYx7q"); // ضع عنوان محفظتك التجريبية

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: treasury,
      lamports,
    })
  );

  const signature = await wallet.sendTransaction(transaction, connection);
  alert(`تم إرسال العملية ✅\nالتوقيع: ${signature}`);
}

// ربط الأزرار
connectPhantomBtn.addEventListener("click", () => connectWallet("phantom"));
connectSolflareBtn.addEventListener("click", () => connectWallet("solflare"));
disconnectBtn.addEventListener("click", disconnectWallet);
switchBtn.addEventListener("click", switchNetwork);
buyNowBtn.addEventListener("click", buyNow);