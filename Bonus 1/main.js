function createCounter(init) {
    let count = init;
    return {
        increment: function () {
            count = count + 1;
            return count;
        },
        decrement: function () {
            count = count - 1;
            return count;
        },
        reset: function () {
            count = init;
            return count;
        }
    };
}

const counter = createCounter(5);
console.log(counter.increment());
console.log(counter.reset());
console.log(counter.decrement()); 