/**
 *
 * name: data
 * date: 2018/11/3
 * author: cengfucheng
 * about: 模拟数据
 *
 */


//item的data 就是接收传值的地方。交互传值，父子传值，兄弟传值等等
// 数据汇总后，data先为数组，然后遍历一次，用对象来装所有节点。第一个给个start标示
// 节点data，存储交互数据。然后传入一个第三方js，进行步进操作。

// 节点数据传送：首先根据 next 指向的 id, 然后根据类型 node 就传 id，child 就传 parentId ;
// 如果携带数据，就存在 progs;

// group里面的操作，决定进入分支否，又决定进入哪个分支。 分支具备 node 的一切属性，只是 为 child 而已。


//后面再写个格式化数据，一切数据采用格式化，模版输出成 data。现在实在忙不过来。

let uuid = function(){
    return Math.round(Date.now() * Math.random());
}
let data = [];

let child11 = {
    type: 'child',
    id: uuid(),
    next: '12',
    data: [],
}

let child12 = {
    type: 'child',
    id: uuid(),
    next: '12',
    data: [],
}

let child1 = {
    type: 'child',
    id: uuid(),
    next: '1',
    data: []
}
let child2 = {
    type: 'child',
    id: uuid(),
    next: '2',
    data: [],
    child: [child11, child12]
}
let item1 = {
    type: 'node' || 'child',
    id: uuid(),
    next: '1',
    component: [
        {type: 'com', id: 0, config: {src: '/assets/bg.jpg', width: 708, height: 469}},
        {type: 'com', id: 1, config: {src: '/assets/tuzi-0.jpg', width: 444, height: 671}},
        {type: 'com', id: 2, config: {src: '/assets/tuzi-1.jpg', width: 468, height: 704}}],
    group: {
        'xxx': {
            name: '兔子',
            age: 15,
            image: 'assets/tuzi-0.jpg',
            width: 300,
            height: 400
        },
        'yyy': {
            name: '小兔子',
            age: 6,
            image: 'assets/tuzi-1.jpg',
            width: 300,
            height: 400
        }
    },
    data: [
        {
            type: '对话',
            from: 'xxx',
            text: 'hi，小兔子,how are you。'
        },
        {
            type: '对话',
            from: 'yyy',
            text: 'nice to you me too'
        },
        {
            type: '对话',
            from: 'xxx',
            text: '你也要一颗吗？'
        },
        {
            type: '选择',
            value: ''
        }
    ],
    props: [],
    child: [child1,child2]
}

let item2 = {
    type: 'node',
    id: uuid(),
    next: '2',
    data: []
}

let item3 = {
    type: 'node',
    id: uuid(),
    next: '4',
    data: []
}

let item4 = {
    type: 'node',
    id: uuid(),
    next: 'end',
    data: []
}

child1.next = item2.id;
child2.next = item3.id;
item1.next = item2.id;
item2.next = item3.id;
item3.next = item4.id;

data = Array.of(item1,item2,item3,item4);
export default data;
