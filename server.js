const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { json } = require('body-parser');
const { error } = require('console');
const { parse } = require('path');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json())
app.use(express.static('public'));

const file = 'adatok.json';

if(!fs.existsSync(file)){
    fs.existsSync(file, JSON.stringify([]))
}

function betoltadatok(){
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function mentadatok(){
    fs.writeFileSync(file, JSON.stringify(adatok, null, 2));
}

app.get('/api/termekek', (req, res) => {
    res.json(betoltadatok());
});

app.post('/api/termekek', (req, res) => {
    const {nev, tipus, mennyiseg} = req.body;
    if(!nev || !tipus || !mennyiseg){
        return res.status(404).json({error : "Minden mező kitöltése kötelező!"})
    }
    const adatok = betoltadatok();
    const uj = {id : Date.now(), nev, tipus, mennyiseg : parseFloat(mennyiseg)}
    adatok.push(uj);
    mentadatok(adatok);
    res.json({message : 'Termék hozzáadása', uj})
});

app.put('/api/termekek/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {nev, tipus, mennyiseg} = req.body;

    let adatok = betoltadatok();
    const index = adatok.findIndex(t => t.id === id);

    if(index === -1) return res.status(404).json({error: 'Nincs ilyen termék'})

    adatok[index] = {...adatok[index], nev, tipus, mennyiseg : parseFloat(mennyiseg)}

    mentadatok(adatok);

    res.json({message: 'Termékek módosítva', uj: adatok[index] }) 
});

app.delete('/api/termekek/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let adatok = betoltadatok();

    let index = adatok.findIndex(t => t.id === id);
    mentadatok(adatok);

    res.json({message: 'Termékek törölve'})
});

app.listen(port, () => {
    console.log("Szerver fut a 4000-es porton!")
});