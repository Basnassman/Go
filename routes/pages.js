import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.render('home', { title: 'Home' }));
router.get('/whitepaper', (req, res) => res.render('whitepaper', { title: 'Whitepaper' }));
router.get('/airdrop', (req, res) => res.render('airdrop', { title: 'Airdrop' }));
router.get('/how-to-buy', (req, res) => res.render('how-to-buy', { title: 'How to Buy' }));
router.get('/purchase', (req, res) => res.render('purchase', { title: 'Purchase' }));

export default router;