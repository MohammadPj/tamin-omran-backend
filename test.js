const express = require('express');

const app = express();

app.get('/api' , (req, res, next) => {
	res.send('trest')
});


const port = 4000
app.listen(port, () => {
	console.log(`server started on port ${port}`)
})
