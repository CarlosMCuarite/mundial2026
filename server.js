const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const contadorPath = path.join(__dirname, 'contador.json');

if (!fs.existsSync(contadorPath)) {
    fs.writeFileSync(
        contadorPath,
        JSON.stringify({ visitas: 0 }, null, 2)
    );
}

app.get('/api/visitas', (req, res) => {
    try {
        const contador = JSON.parse(
            fs.readFileSync(contadorPath, 'utf8')
        );

        contador.visitas++;

        fs.writeFileSync(
            contadorPath,
            JSON.stringify(contador, null, 2)
        );

        res.json({
            visitas: contador.visitas
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al contar visitas'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});