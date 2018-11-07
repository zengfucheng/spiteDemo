/**
 *
 * name: data
 * date: 2018/11/3
 * author: cengfucheng
 * about: 模拟数据
 *
 */

let data ={

}


//item的data 就是接收传值的地方。交互传值，父子传值，兄弟传值等等
// 数据汇总后，data先为数组，然后遍历一次，用对象来装所有节点。第一个给个start标示
// 节点data，存储交互数据。然后传入一个第三方js，进行步进操作。

// 节点数据传送：首先根据 next 指向的 id, 然后根据类型 node 就传 id，child 就传 parentId ;
// 如果携带数据，就存在 progs;


let item1 = {
    type: 'node' || 'child',
    parentId: null,
    id: '0',
    prev: 0,
    next: null,
    data: [],
    props: [],
    child: [child1,child2]
}

let child1 = {
    id: '0-1',
    prev: 0,
    next: '1',
    data: []
}
let child2 = {
    id: '0-2',
    prev: 0,
    next: '2',
    data: []
}

let item2 = {
    id: '1',
    prev: 0,
    next: '2',
    data: []
}

let item2 = {
    id: '2',
    prev: 0,
    next: 'end',
    data: []
}

