app.get('/', (req, res) => {
    if(req.session.email){
        return res.json({valid: true, email: req.session.email})
    }else {
        return res.json({valid: false})
    }
})

app.post('/register', (req, res) => {
    const sql = "INSERT into users ('email', 'password', 'firstname', "
})