const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join('.', 'salary-list.json');
const EARNINGS_FILE = path.join('.', 'earnings.json');
const WISHLIST_FILE = path.join('.', 'wishlist.json');
const SPENDING_FILE = path.join('.', 'spending.json');

if (!fs.existsSync(EARNINGS_FILE)) {
    fs.writeFileSync(EARNINGS_FILE, JSON.stringify({ earnings: [] }, null, 2));
}

if (!fs.existsSync(WISHLIST_FILE)) {
    fs.writeFileSync(WISHLIST_FILE, JSON.stringify({ wishes: [] }, null, 2));
}

if (!fs.existsSync(SPENDING_FILE)) {
    fs.writeFileSync(SPENDING_FILE, JSON.stringify({ spending: [] }, null, 2));
}


// GET /api/levels
app.get("/api/levels", (req, res) => {
    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to read salary list" });
        }
        try {
            const json = JSON.parse(data);
            res.json(json.levels);
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).json({ error: "Invalid JSON format" });
        }
    });
});

app.post("/api/earnings", (req, res) => {
    const newEntry = req.body;

    if (!newEntry.kidName || !newEntry.task || !newEntry.minutes || !newEntry.salaryLevel) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    fs.readFile(EARNINGS_FILE, "utf-8", (err, data) => {
        if (err) {
            console.error("Error reading earnings file:", err);
            return res.status(500).json({ error: "Failed to read earnings data" });
        }

        let json;
        try {
            json = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing earnings file:", parseErr);
            json = { earnings: [] };
        }

        json.earnings.push({
            ...newEntry,
            id: Date.now(), // simple unique ID
            createdAt: new Date().toISOString(),
        });

        fs.writeFile(EARNINGS_FILE, JSON.stringify(json, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing earnings file:", writeErr);
                return res.status(500).json({ error: "Failed to save entry" });
            }
            res.status(201).json({ message: "Work entry saved successfully" });
        });
    });
});

app.get("/api/earnings/:kidName", (req, res) => {
    const { kidName } = req.params;

    fs.readFile(EARNINGS_FILE, "utf-8", (err, data) => {
        if (err) {
            console.error("Error reading earnings file:", err);
            return res.status(500).json({ error: "Failed to read earnings data" });
        }

        let json;
        try {
            json = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing earnings file:", parseErr);
            json = { earnings: [] };
        }

        // Filter entries for the requested kid
        const kidEarnings = json.earnings.filter(e => e.kidName === kidName);
        res.json(kidEarnings);
    });
});

// DELETE /api/earnings/:id
app.delete("/api/earnings/:id", (req, res) => {
    const entryId = Number(req.params.id);

    fs.readFile(EARNINGS_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let json = JSON.parse(data);
        const originalLength = json.earnings.length;

        json.earnings = json.earnings.filter(e => e.id !== entryId);

        if (json.earnings.length === originalLength) {
            return res.status(404).json({ error: "Entry not found" });
        }

        fs.writeFile(EARNINGS_FILE, JSON.stringify(json, null, 2), () => {
            res.json({ message: "Entry deleted" });
        });
    });
});


// PUT /api/earnings/:id
app.put("/api/earnings/:id", (req, res) => {
    const entryId = Number(req.params.id);
    const updated = req.body;

    fs.readFile(EARNINGS_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let json = JSON.parse(data);
        const idx = json.earnings.findIndex(e => e.id === entryId);

        if (idx === -1) return res.status(404).json({ error: "Entry not found" });

        json.earnings[idx] = { ...json.earnings[idx], ...updated };

        fs.writeFile(EARNINGS_FILE, JSON.stringify(json, null, 2), () => {
            res.json({ message: "Entry updated" });
        });
    });
});

// GET one entry by kidName + entryId
app.get("/api/earnings/:kidName/:entryId", (req, res) => {
    const { kidName, entryId } = req.params;

    fs.readFile(EARNINGS_FILE, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read earnings data" });
        }

        let json = JSON.parse(data);

        const entry = json.earnings.find(
            e => e.kidName === kidName && e.id === Number(entryId)
        );

        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }

        res.json(entry);
    });
});

// GET all wishes for a kid
app.get("/api/wish-list/kid/:kidName", (req, res) => {
    const { kidName } = req.params;
    fs.readFile(WISHLIST_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read wish data" });

        let json = JSON.parse(data);
        const kidWishes = json.wishes.filter(w => w.kidName === kidName);
        res.json(kidWishes);
    });
});

// GET single wish by ID
app.get("/api/wish-list/:id", (req, res) => {
    const id = Number(req.params.id);
    fs.readFile(WISHLIST_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read wish data" });

        let json = JSON.parse(data);
        const wish = json.wishes.find(w => w.id === id);

        if (!wish) return res.status(404).json({ error: "Wish not found" });
        res.json(wish);
    });
});

// POST add new wish
app.post("/api/wish-list", (req, res) => {
    const newWish = req.body;
    if (!newWish.kidName || !newWish.wish || !newWish.price) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    fs.readFile(WISHLIST_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read wish data" });

        let json;
        try {
            json = JSON.parse(data);
        } catch {
            json = { wishes: [] };
        }

        json.wishes.push({
            ...newWish,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        });

        fs.writeFile(WISHLIST_FILE, JSON.stringify(json, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Failed to save wish" });
            res.status(201).json({ message: "Wish added successfully" });
        });
    });
});

// PUT update wish
app.put("/api/wish-list/:id", (req, res) => {
    const id = Number(req.params.id);
    const updated = req.body;

    fs.readFile(WISHLIST_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read wish data" });

        let json = JSON.parse(data);
        const idx = json.wishes.findIndex(w => w.id === id);

        if (idx === -1) return res.status(404).json({ error: "Wish not found" });

        json.wishes[idx] = { ...json.wishes[idx], ...updated };

        fs.writeFile(WISHLIST_FILE, JSON.stringify(json, null, 2), () => {
            res.json({ message: "Wish updated" });
        });
    });
});

// DELETE wish
app.delete("/api/wish-list/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile(WISHLIST_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read wish data" });

        let json = JSON.parse(data);
        const originalLength = json.wishes.length;

        json.wishes = json.wishes.filter(w => w.id !== id);

        if (json.wishes.length === originalLength) {
            return res.status(404).json({ error: "Wish not found" });
        }

        fs.writeFile(WISHLIST_FILE, JSON.stringify(json, null, 2), () => {
            res.json({ message: "Wish deleted" });
        });
    });
});


// GET spending list by kid name
app.get("/api/spending/:kidName", (req, res) => {
    const { kidName } = req.params;

    fs.readFile(SPENDING_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read spending data" });

        const json = JSON.parse(data);
        const items = json.spending.filter(s => s.kidName === kidName);
        res.json(items);
    });
});

// -----------------------------------------------
// GET one spending entry by kidName + spendingId
// -----------------------------------------------
app.get("/api/spending/:kidName/:id", (req, res) => {
    const { kidName, id } = req.params;

    fs.readFile(SPENDING_FILE, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read spending data" });
        }

        const json = JSON.parse(data);
        const entry = json.spending.find(
            (s) => s.kidName === kidName && s.id === Number(id)
        );

        if (!entry) {
            return res.status(404).json({ error: "Spending entry not found" });
        }

        res.json(entry);
    });
});

// POST new spending
app.post("/api/spending", (req, res) => {
    const newEntry = req.body;

    if (!newEntry.kidName || !newEntry.item || !newEntry.price || !newEntry.store || !newEntry.date) {
        return res.status(400).json({ error: "Invalid data" });
    }

    fs.readFile(SPENDING_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read spending file" });

        let json = JSON.parse(data);
        json.spending.push({
            ...newEntry,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });

        fs.writeFile(SPENDING_FILE, JSON.stringify(json, null, 2), () => {
            res.status(201).json({ message: "Spending saved" });
        });
    });
});

// DELETE spending item
app.delete("/api/spending/:id", (req, res) => {
    const entryId = Number(req.params.id);

    fs.readFile(SPENDING_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read" });

        let json = JSON.parse(data);
        const oldLength = json.spending.length;
        json.spending = json.spending.filter(s => s.id !== entryId);

        if (json.spending.length === oldLength) {
            return res.status(404).json({ error: "Entry not found" });
        }

        fs.writeFile(SPENDING_FILE, JSON.stringify(json, null, 2), () => {
            res.json({ message: "Deleted" });
        });
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
