const authorModel = require('../models/author_model')
const moment = require ('moment')

// get all authors
async function getAllAuthors(req, res){
    const authors = await authorModel.find()

    res.status(200).json({
        status: true,
        message: authors
    })
}


// get author by ID - author's profile
async function getAuthor(req, res){
    const id = req.params.id

    const author = await authorModel.findById(id)

    if(!author){
        return res.status(500).json({
            status: false,
            message: 'invalid ID'
        })
    }

    else{
        return res.status(200).json({
            status: true,
            message: author
        })
    }
}


// post or create a new author, this should be linked to the signup route
const createNewAuthor = async function(req, res){
    const body = req.body

    const newAuthor = await authorModel.create({
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        gender: body.gender,
        bio: body.bio,
        dob: body.dob,
        country: body.country,
        createdAt: moment().toDate()
    })

    return res.status(200).json({
        status: true,
        message: newAuthor
    })
}


// update author details by ID
const updateAuthor = async function(req, res){
    const id = req.params.id
    const updatedData = req.body

    try{
        if (!id){
            return res.status(500).json({
                status: false,
                message: 'Invalid ID used!'
            })
        }

        const currentAuthor = await authorModel.findById(id)

        if(!currentAuthor){
            return res.status(403).json({
                status: false,
                message: 'Author does not exist! Sign Uo to become an Author!'
            })
        }

        if(Object.keys(updatedData).length === 0){
            return res.status(404).json({
                status: false,
                message: currentAuthor,
                info: 'No update made!'
            })
        }

        const updatedAuthor = await authorModel.findByIdAndUpdate(id, {$set: updatedData}, {$new: true})

        const username = updatedAuthor.username
        const bio = updatedAuthor.bio
        const dob = updatedAuthor.dob
        const country = updatedAuthor.country
        const lastUpdatedAt = moment().toDate()
        updatedAuthor.lastUpdatedAt = lastUpdatedAt

        await updatedAuthor.save()

        return res.status(200).json({
            status: true,
            message: updatedAuthor
        })
    }
    catch(err){
        return res.status(404).json({
            status: false,
            message: err.details[0].message
        })
    }

}

// delete author by Id
async function deleteAuthor (req, res){
    const id = req.params.id

    const deletedAuthor = await authorModel.findByIdAndDelete(id)

    if(!id){
        return res.status(500).json({
            status: false,
            message: 'Invalid ID!'
    })
}
    return res.status(200).json({
        status: true,
        message: deletedAuthor
    })
}



module.exports ={
    getAllAuthors,
    getAuthor,
    createNewAuthor,
    updateAuthor,
    deleteAuthor
}