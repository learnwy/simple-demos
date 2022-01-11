Object.assign(exports, require('./add'), require('./sub'), require('./mul'), require('./div'))

exports.changeAdd = function () {
    exports.add = function (num1, num2) {
        console.log('changed add')
        return num1 + num2
    }
}
