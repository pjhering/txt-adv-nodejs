
var test = ['zero', 'one', 'two', 'three', 'four', 'five'];
console.log('test = ' + test);
console.log();

var front = test.slice(0, 2);
console.log('test.slice(0, 2) = ' + front);
console.log('test = ' + test);
console.log();

var back = test.slice(3, test.length);
console.log('test.slice(3, test.length) = ' + back);
console.log('test = ' + test);
console.log();

var removed = front.concat(back);
console.log('front.concat(back) = ' + removed);
console.log('test = ' + test);
console.log();

console.log('removeIndex(test, 2) = ' + removeIndex(test, 2));
console.log('test = ' + test);
console.log();

console.log('removeElement(test, "two") = ' + removeElement(test, 'two'));
console.log('test = ' + test);
console.log();

function removeIndex(array, index)
{
    if(!(array instanceof Array)) return array;
    if(array.length == 0) return array;
    if(index < 0 || index >= array.length) return array;

    var f = array.slice(0, index);
    var b = array.slice(index + 1, array.length);
    return f.concat(b);
}

function removeElement(array, element)
{
    return removeIndex(array, array.indexOf(element));
}
