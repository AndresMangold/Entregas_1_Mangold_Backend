const { Router } = require('express')
const { User } = require('../dao/models')
const userModel = require('../dao/models/user.model')

const router = Router()

router.post('/', async (req, res) => {

    const {firstName, lastname, email} = req.body

    if(!firstName||lastname||email) return res.send({
        status: "error", error: "Incomplete values"
    });
    
    const result = await User.create({
        firstName,
        lastname,
        email,
    })

    res.json(result)

})

router.get('/', async (req, res) => {
    try {
        const users = await User.find({})

        return res.json(users)
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const users = await User.findOne({ _id: req.params.id })

        if (!user) {
            res.status(404).json({message: 'User not found'})
        }

        return res.json(users)
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.put('/:uid', async (req, res) => {
    let {uid} = req.params;

    let userToReplace = req.body;
    if(!userToReplace.firstName||!userToReplace.lastname||!userToReplace.email) return res.send({
        status:"error", error:"Incomplete values"})
    let result = await userModel.updateOne({_id:uid}, userToReplace)
    res.send({status: "succes", payload:result})
})

router.delete('/:uid', async (req, res) => {
    let {uid} = req.params;

    let result = await userModel.deleteOne({_id:uid})
    res.send({status: "succes", payload:result})
})

module.exports = router