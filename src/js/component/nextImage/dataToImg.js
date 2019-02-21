/**
 *
 * name: dataToImg
 * date: 2018/11/25
 * author: cengfucheng
 * about: 模拟帧动画数据
 *
 */


// 根数据，到底是 数组，还是对象。待后续
// let config = {
//
// }


// 先构建基本的帧动画对象，该对象有自身的各种状态。如 表情帧动画：笑，哭，惊讶等等

let obj = [
    {
        name: '嘴-笑',
        mode: 'point', //换坐标
        target: {
            source: 'img',
            data: ['0,0', '100,0']              //坐标点
        }

    },
    {
        name: '眼-笑',
        mode: 'point', //换坐标
        target: {
            source: 'img',
            data: ['0,0', '100,0']              //坐标点
        }
    },
    {
        name: '嘴-说话',
        mode: 'src',  //换图片
        target: {
            source: ['img', 'img', 'img']
        }
    },
    {
        // 嘴说话和嘴巴上翘（笑）在一个配置里面 换坐标 方式
        name: '嘴',
        mode: 'point', //换坐标
        state: 0,       // 默认状态
        target: {
            source: 'img',
            data: [
                {
                    tag: '嘴-说话',
                    data: ['0,0', '100,0']
                },
                {
                    tag: '嘴-笑',
                    data: ['100,100', '100,200']
                }
            ]
        }
    },
    {
        // 嘴说话和嘴巴上翘（笑）在一个配置里面 换图片方式
        name: '嘴',
        mode: 'src', //换坐标
        state: 0,       // 默认状态
        target: {
            data: [
                {
                    tag: '嘴-说话',
                    source: ['img1', 'img2']
                },
                {
                    tag: '嘴-笑',
                    source: ['img3', 'img4']
                }
            ]
        }
    },
    {
        // 换坐标，图片来源不一
        // 嘴说话和嘴巴上翘（笑）在一个配置里面 换坐标 方式
        name: '嘴',
        mode: 'point', //换坐标
        state: 0,       // 默认状态
        target: {
            data: [
                {
                    source: 'img',
                    tag: '嘴-说话',
                    data: ['0,0', '100,0']
                },
                {
                    source: 'img',
                    tag: '嘴-笑',
                    data: ['100,100', '100,200']
                }
            ]
        },
        animal: [],  // 存放 生成可以运行的组件

    }
]


let config = {
    uid: '1234567890',      // 到时候自动生成uid
    name: '奇美拉',
    group: [                // 动画运行组合
        [
            {
                name: '眨眼',
                data: '1-1',
                time: 200,
                count: NaN,
                wait: 1750
            }
        ],
        [
            {
                name: '眨眼',
                data: '1-0',
                time: 200,
                count: NaN,
                wait: 1750
            }
        ],
        [
            {
                name: '说话',
                data: '2-0',
                time: 200,
                count: 2,
                wait: 100
            }
        ]
    ],
    module: [               // 图片配置信息
        {
            name: '人物背景',
            mode: 'src',
            state: 0,       // 默认状态
            autoPlay: false,
            target: {
                source: 'assets/girl/bg.jpg'
            }
        },
        {
            // 换坐标，图片来源不一
            // 嘴说话和嘴巴上翘（笑）在一个配置里面 换坐标 方式
            name: '眼睛',
            mode: 'src', //换坐标
            state: 0,       // 默认状态
            autoPlay: false,
            target: {
                data: [
                    {
                        source: ['assets/girl/eyes/k-dx-2.png', 'assets/girl/eyes/k-dx-1.png'],
                        tag: '眼-眨眼'
                    },
                    {
                        source: ['assets/girl/eyes/x-dx-2.png', 'assets/girl/eyes/x-dx-1.png'],
                        tag: '眼-眨眼1'
                    }
                ]
            }
        },
        {
            // 换坐标，图片来源不一
            // 嘴说话和嘴巴上翘（笑）在一个配置里面 换坐标 方式
            name: '嘴',
            mode: 'src', //换坐标
            state: 0,       // 默认状态
            autoPlay: false,
            target: {
                data: [
                    {
                        source: ['assets/girl/mouths/zk-dx-1.png', 'assets/girl/mouths/zk-dx-2.png'],
                        tag: '嘴-说话'
                    }
                ]
            }
        }
    ]
}

export default config;
