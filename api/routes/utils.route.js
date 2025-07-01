// backend/routes/utils.route.js
import express from 'express';
import fs from 'fs';
const router = express.Router();

router.get('/clustermap', (req, res) => {
  try {
    const raw = fs.readFileSync('./backend/data/clusterMap.json');
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load cluster map' });
  }
});

export default router;
