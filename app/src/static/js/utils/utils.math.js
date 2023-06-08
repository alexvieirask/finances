class MathConversions {
    static convertMoneyIntegerToFloat(value){
        try{
            return (value / 100).toFixed(2)
        }
        catch(error){
            console.log(error)
        }
    }

    static convertMoneyFloatToInteger(value){
        try{
            return value * 100
        }
        catch(error){
            console.log(error)
        }
    }
}

export { MathConversions}