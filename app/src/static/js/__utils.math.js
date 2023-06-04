class MathConversions {
    static convertMoneyIntegerToFloat(value){
        return (value / 100).toFixed(2)
    }

    static convertMoneyFloatToInteger(value){
        return value * 100
    }
}

export { MathConversions}