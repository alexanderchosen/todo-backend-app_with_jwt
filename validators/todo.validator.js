const Joi  = require ('joi')

const addTodoValidator = Joi.object({

    title: Joi.string()
            .min(5)
            .max(50)
            .trim()
            .required(),

    shortDescription: Joi.string()
                        .min(10)
                        .max(255)
                        .trim(),

    content: Joi.string()
                .min(10)
                .required(),

    created_at: Joi.date()
                    .default(Date.now)
                    .required(),

    category: Joi.string()
                .required()
})


const updateTodoValidator = Joi.object({

    title: Joi.string()
            .min(5)
            .max(50)
            .trim()
            .optional(),

    shortDescription: Joi.string()
                        .min(10)
                        .max(255)
                        .trim(),

    content: Joi.string()
                .min(10)
                .optional(),

    lastUpdatedAt: Joi.date()
                    .default(Date.now)
                    .required(),

    category: Joi.string()
                .optional()
})

async function addTodoValidatorMW  (req, res, next){
    const todoPayLoad = req.body

    try{
        await addTodoValidator.validateAsync(todoPayLoad)
        next()
    }
    catch(error){
        console.log(error)
        return res.status(406).json({
            status: false,
            message: "An Error Occured",
            info: error.details[0].message
        })
    }
}


const updateTodoValidatorMW = async function (req, res, next){
    const updatedTodoPayload = req.body

    try{
        await updateTodoValidator.validateAsync(updatedTodoPayload)
        next()
    }
    catch(error){
        return res.status(500).json({
            status: false,
            message: error.details[0].message
        })
    }
}

module.exports = {
    addTodoValidatorMW,
    updateTodoValidatorMW
}