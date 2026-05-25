const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 📥 [১০টি তাজা ছবির মেমোরি লিস্ট লক ভাই]
const aceCardsList = ['ace', 'gold-ace', 'king', 'gold-king', 'queen', 'jack', 'joker', 'spade-a', 'spade-b', 'scatter'];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/ace-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    try {
        const response = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${wallet}`, { timeout: 30000 });
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) {
        return res.json({ success: false, balance: 0 });
    }
});

// 🛫 ২. সুপার এস ৫x৪ স্পিন মেগা এপিআই রাউট (POST Route - ১০২৪ উপায়ে জেতার মেগা ক্যাসিনো ম্যাথ ইঞ্জিন লক ভাই ভাই!)
app.post('/api/ace-spin', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 10;

    try {
        const balCheck = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${targetWallet}`, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balCheck.data && balCheck.data.balance !== undefined && balCheck.data.balance !== null) {
            currentDbBalance = parseFloat(balCheck.data.balance);
        } else if (balCheck.data && balCheck.data.status === "ok") {
            currentDbBalance = 9999999;
        } else {
            currentDbBalance = 9999999; 
        }

        if (currentDbBalance < reqAmount && currentDbBalance !== 9999999) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge." });
        }

        // 🎰 ৫x৪ গ্রিডের জন্য ২০টি র‍্যান্ডম ট্রাস্টেড কার্ড ম্যাট্রিক্স জেনারেট হলো ভাই
        let matrix = [];
        for (let i = 0; i < 20; i++) {
            let randomIndex = Math.floor(Math.random() * aceCardsList.length);
            matrix.push(aceCardsList[randomIndex]);
        }

        // 📊 [৫x৪ গ্রিড বিন্যাস রূপান্তর]: ২০টি সোজা ঘরকে ৫টি কলামে আলাদা করা হলো ভাই ভাই
        // কলাম ০: ঘর [০, ৫, ১০, ১৫], কলাম ১: ঘর [১, ৬, ১১, ১৬] ... ইত্যাদি
        let columns = [[], [], [], [], []];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                columns[col].push({
                    index: (row * 5) + col,
                    symbol: matrix[(row * 5) + col]
                });
            }
        }

        let winLines = [];
        let multiplier = 0;

        // 🎯 [১০২৪ উপায়ে জেতার ইউনিভার্সাল লুপ ভাই ভাই]
        // কলাম ১ এর প্রতিটি ইউনিক কার্ডের জন্য বাম থেকে ডানে ধারাবাহিকতা ম্যাচিং ট্র্যাক করা হচ্ছে ভাই
        let checkedSymbols = new Set();
        
        columns[0].forEach(cell1 => {
            const sym = cell1.symbol;
            if (checkedSymbols.has(sym)) return;
            checkedSymbols.add(sym);

            // প্রতিটি কলামে এই নির্দিষ্ট কার্ড বা জোকারের উপস্থিতি কাউন্ট করা হচ্ছে ভাই
            let colCounts = [0, 0, 0, 0, 0];
            let colMatchedIndices = [[], [], [], [], []];

            for (let c = 0; c < 5; c++) {
                columns[c].forEach(cell => {
                    // JILI Super Ace নিয়মে জোকার (joker) যেকোনো কার্ডের রূপ নিতে পারে ভাই
                    if (cell.symbol === sym || cell.symbol === 'joker') {
                        colCounts[c]++;
                        colMatchedIndices[c].push(cell.index);
                    }
                });
            }

            // ১০২৪ উপায়ের নিয়ম: কলাম ১, ২ এবং ৩ এ অবশ্যই ক্রমান্বয়ে ম্যাচ থাকতে হবে ভাই
            if (colCounts[0] > 0 && colCounts[1] > 0 && colCounts[2] > 0) {
                let matchLength = 3; // ৩ কলাম ম্যাচ (১.২০ গুণ)
                if (colCounts[3] > 0) {
                    matchLength = 4; // ৪ কলাম ম্যাচ (২.৫০ গুণ)
                    if (colCounts[4] > 0) {
                        matchLength = 5; // ৫ কলাম সম্পূর্ণ মেগা ম্যাচ (৫.০০ গুণ ভাই!)
                    }
                }

                // ১০২৪ ওয়েজ এর আসল গুনিতক হিসাব: কলামগুলোর সিম্বল সংখ্যা একে অপরের সাথে গুন হবে ভাই ভাই!
                let totalWays = 1;
                let highlightIndices = [];
                for (let i = 0; i < matchLength; i++) {
                    totalWays *= colCounts[i];
                    highlightIndices.push(...colMatchedIndices[i]);
                }

                // বেস রেট নির্ধারণ লুপ
                let baseRate = 0.20;
                if (matchLength === 4) baseRate = 0.50;
                if (matchLength === 5) baseRate = 1.00;

                // মোট মাল্টিপ্লায়ার = বেস রেট * গুন হওয়া ওয়েজ সংখ্যা ভাই ভাই!
                multiplier += (baseRate * totalWays);
                winLines.push(...highlightIndices);
            }
        });

        // 🌟 [ডানাওয়ালা gold-ace এবং scatter বোনাস মাল্টিপ্লায়ার ফ্ল্যাশ লক]
        if (matrix.includes('gold-ace') || matrix.includes('scatter')) {
            if (multiplier > 0) {
                multiplier = parseFloat((multiplier * 1.50).toFixed(2)); // ১.৫ গুণ জ্যাকপট বুস্ট ভাই ভাই!
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (multiplier > 0) {
            winAmount = Math.floor(reqAmount * multiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount);
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = parseFloat(multiplier).toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                matrix: matrix,
                winAmount: winAmount,
                multiplier: multiplier > 0 ? multiplier : 1.00,
                winLines: [...new Set(winLines)]
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            if (latestBal === 9999999) latestBal = 0;
            return res.json({ success: false, balance: latestBal, message: response.data.message || "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Super Ace 1024 Ways Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Connection Timeout! Click SPIN again." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Player connected to Super Ace Game Engine!");
});

const PORT = process.env.PORT || 12000;
server.listen(PORT, () => {
    console.log(`♠️ JILI Super Ace Engine Running on port ${PORT}`);
});
