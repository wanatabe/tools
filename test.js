console.log('testDat', testData);
let newArr = [];
let oldArr = [];
for (let index = 0; index < testData.length; index++) {
    const item = testData[index];
    const data = oldArr.find((pre) => pre.deId === item.deId);
    if (data) {
        newArr.push(item);
    } else {
        oldArr.push(item);
    }
}

console.log('newArr', newArr, oldArr)

