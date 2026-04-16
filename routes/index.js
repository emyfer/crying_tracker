const express = require("express");
//const { Client } = require('pg');
const { Pool } = require('pg');
require("dotenv").config();
const { requiresAuth } = require('express-openid-connect');
var router = express.Router();

/*const con = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
con.connect().then(() => console.log("connected"));*/


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, 
  max: 20
});

pool.connect().then(() => console.log("connected to Neon"))
  .catch(err => console.error('Connection error:', err));

async function getOrCreateUser(auth0User) {
    const auth0Id = auth0User.sub;
    const email = auth0User.email;
    const username = auth0User.nickname;

    let user = await pool.query(
        "SELECT * FROM users WHERE auth0_id = $1",
        [auth0Id]
    );

    if (user.rows.length === 0) {
        user = await pool.query(
            "INSERT INTO users (auth0_id, email) VALUES ($1, $2) RETURNING *",
            [auth0Id, email]
        );
    }

    return user.rows[0];
}

router.get("/", async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.redirect("/login");
    }

    await getOrCreateUser(req.oidc.user);

    res.render("landing");
});

router.get('/logout', (req, res) => {
  res.oidc.logout({
    returnTo: '/'
  });
});

router.get("/cry_form", requiresAuth(), (req, res) => {
    res.render('cry_login', { showSuccess: false });
});

router.post("/cry_form", requiresAuth(), async (req, res) => {
    const { intensity, mood, reason, description } = req.body;

    try {
        const dbUser = await getOrCreateUser(req.oidc.user);

        await pool.query(
            `INSERT INTO cries 
            (cry_date, intensity, mood, reason, description, user_id) 
            VALUES (CURRENT_DATE, $1, $2, $3, $4, $5)`,
            [intensity, mood, reason, description, dbUser.id]
        );

        res.render('cry_login', { showSuccess: true });
    } catch(err) {
        console.error(err);
        res.send("Error saving data");
    }
});

router.get("/stats", requiresAuth(), async (req, res) => {
    try {
        const dbUser = await getOrCreateUser(req.oidc.user);
        const totalRes = await pool.query(
            "SELECT COUNT(*) FROM cries WHERE user_id = $1",
            [dbUser.id]
        );        
        const intensityRes = await pool.query("SELECT intensity, COUNT(*) FROM cries WHERE user_id = $1 GROUP BY intensity", [dbUser.id]);
        const moodRes = await pool.query("SELECT mood, COUNT(*) FROM cries WHERE user_id = $1 GROUP BY mood", [dbUser.id]);
        const reasonRes = await pool.query("SELECT reason, COUNT(*) FROM cries WHERE user_id = $1 GROUP BY reason", [dbUser.id]);
        const timelineRes = await pool.query(
            `SELECT cry_date, COUNT(*) AS count
            FROM cries
            WHERE user_id = $1
            GROUP BY cry_date
            ORDER BY cry_date ASC`,
            [dbUser.id]
    );


        res.render('stats', {
            total: totalRes.rows[0].count,
            intensity: intensityRes.rows,
            mood: moodRes.rows,
            reason: reasonRes.rows,
            timeline: timelineRes.rows
        });
    } catch (err) {
        console.error(err);
        res.send("Error fetching stats");
    }
});


module.exports = router;
