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

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]: আপনার ওরিজিনাল মেইন সাইটের ডাটাবেজ ব্যাকএন্ড লিঙ্ক
const MAIN_SITE_URL = "https://onrender.com"; 

// 🃏 JILI Super Ace কার্ড প্রতীক তালিকা লক ভাই (Ace, King, Queen, Jack, Spades)
const aceCardsList = ['ace', 'king', 'queen', 'jack', 'spade-a', 'spade-b', 'gold-ace', 'gold-king', 'joker'];

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

// 🛫 ২. সুপার এস ৫x৪ স্পিন মেগা এপিআই রাউট (POST Route - কড়া সিকিউরিটি ফিল্টার লক ভাই ভাই!)
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
            currentDbBalance = 9999999; // ওল্ড সেশন ড্রপ ব্যাকআপ লক ভাই
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

        let winLines = [];
        let multiplier = 1;

        // ৫ কলামের পাশাপাশি ঘর ম্যাচিং মেগা ম্যাথমেটিক্স লুপ ভাই
        const comboRows = [
            [0, 1, 2, 3, 4],     // Row 1
            [5, 6, 7, 8, 9],     // Row 2
            [10, 11, 12, 13, 14], // Row 3
            [15, 16, 17, 18, 19]  // Row 4
        ];

        comboRows.forEach(line => {
            // যদি লাইনে ৩টি বা তার বেশি কার্ড ম্যাচ করে তবেই উইন ভাই
            if (matrix[line[0]] === matrix[line[1]] && matrix[line[1]] === matrix[line[2]]) {
                winLines.push(line[0], line[1], line[2]);
                multiplier += 1.50;
                if (matrix[line[2]] === matrix[line[3]]) {
                    winLines.push(line[3]);
                    multiplier += 1.50;
                }
            }
        });

        // গোল্ডেন কার্ড এবং জোকার কম্বো থাকলে মাল্টিপ্লায়ার ধামাকা বুস্ট x৫ ভাই!
        if (matrix.includes('gold-ace') || matrix.includes('joker')) {
            multiplier += 2.00;
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (multiplier > 1) {
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
                multiplier: multiplier,
                winLines: [...new Set(winLines)]
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            if (latestBal === 9999999) latestBal = 0;
            return res.json({ success: false, balance: latestBal, message: response.data.message || "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Super Ace Core Database Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click SPIN again." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Player connected to Super Ace Game Engine!");
});

// ৪ নম্বর গেম ১১০০০ এ চলছে, তাই ৫ নম্বর গেমের জন্য ফ্রেশ কাস্টম পোর্ট ১২০০০ লক হলো ভাই ভাই!
const PORT = process.env.PORT || 12000;
server.listen(PORT, () => {
    console.log(`♠️ JILI Super Ace Engine Running on port ${PORT}`);
});
