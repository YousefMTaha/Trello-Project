
export const validation = (JoiSchema) =>{
    return (req,res,next)=>{
        const validateResult = JoiSchema.body.validate({...req.params,...req.body,...req.file},{abortEarly:false})
        if(validateResult.error)
        return res.json({validateErr: validateResult})
        return next()
    }
    
}
export const validationWithToken = (JoiSchema) =>{
    return (req,res,next)=>{
        const validateResult = JoiSchema.body.validate({...req.params,...req.body,...req.file ,token:req.headers.authorization},{abortEarly:false})
        if(validateResult.error)
        return res.json({validateErr: validateResult})
        return next()
    }
    
}