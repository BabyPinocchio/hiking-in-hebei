Page({ // 看这个大括号，大括号表示这是个对象，下面的函数都是对象里的函数
  // 这个是默认的项目骨架，下面有一大堆函数，咱们用不着，留一个onload就可以
  /**
   * 页面的初始数据
   */
  data: { // 这个地方是放我们页面上要展示的数据
    // 我们现在要把接口里的东西请求回来，放在这个data里
    // 现在的前端编程跟你以前接触到的其他编程不一样，现在更高级了
    // 以前写C++或者安卓是，拿到了数据，要去找到对应的控件，告诉控件去展示
    // 现在前端把这个过程简化了，只要控件绑定一个变量，这个变量一改，控件会自动更新
    // 1. 初始的时候，我们展示一个空的数组
    // 就是还没加载的时候，这个文章列表是空的
    posts: []
  },

  // 这个是页面打开的时候会执行的函数
  // JS里面，对象里是 “名字: 内容”
  // 比如下面这个意思是 对象里有一个东西叫onLoad，内容是一个函数，这个函数有个参数叫options
  // JS的变量都没有类型
  // 然后，这种写法也可以简写为 onLoad(options){...}
  onLoad: function (options) {
    // 2. 加载的时候，需要去请求那个接口，把拿到的东西赋给data里的posts，让他变成有内容的

    let that = this //var/let都可以，现在一般用let；给这个地方的this起个别名，叫that，你也可以起别的名字比如self

    wx.request({ // 微信小程序的网络请求函数
      url: 'https://as.myseu.cn/yzxserv/post', // 请求的地址
      method: 'GET', // 请求的方法，HTTP里有四种常用的方法，GET/POST/PUT/DELETE
      // GET一般表示取数据，POST表示提交新数据，PUT表示更新旧数据，DELETE表示删除数据
      // 后端会告诉你某个接口用哪个方法，比如现在我告诉你取所有文章用GET方法

      // JS里面的网络请求、读写文件等等不是同步的，不会在request调用的时候就返回给你
      // 因为网络请求是需要时间的，这段时间里不能让程序暂停，不然会影响用户体验
      // JS一般用回调来处理这件事，就是你把请求成功之后要执行的函数给他，让他帮你调用
      // 这里就把请求成功的函数给他
      success: function(res) { // 如果成功了，会自动执行这个函数
        // res.statusCode 表示服务器返回的状态码，200表示成功，400以上表示出错
        // 为什么出错在success里？因为success只是表示成功连接到服务器，但是服务器执行的时候也有可能出错
        // 所以我们先判断这里成功了没
        let posts = res.data
        for (let post of posts) { 
          let d = new Date(post.time) 
          let dt = d.getFullYear() + '年' + (d.getMonth()+1) + '月' +d.getDate() + '日'
          let min = d.getMinutes()
          if (min < 10) {
            min = '0' + min
          }
          let date = dt + ' ' + d.getHours() + ':' + min
          post.time = date
        }
        if (res.statusCode < 400) {// 成功了
          // 这个this，在这里不能正常使用
          // 关于JavaScript中的this，有很复杂的逻辑，我现在只告诉你这个this不能正常表示页面本身
          // 因为他被回调函数function的this给覆盖了
          // 所以我们需要在外面给我们需要的this起个名字
          // 这里就把this改成that了
          that.setData({ // 这个是小程序的修改data函数，我们请求成功了要把data里的posts换成服务器给我们的数组
            posts: res.data // setData 传入一个对象，这个对象里有哪些，小程序就帮我们改哪些，没有的不改
          })
          // 这里把更新之后的posts打印到控制台上，可以看到控制台上打出来的log
          // 如果小程序开发工具里没看到控制台，点左上角的“调试器”切换
          // 现在去小程序开发者工具看看控制台有没有输出
          console.log(that.data.posts)// 小程序修改data一定要用setData函数，否则不会更新界面；但是取data内容只需要直接取就可以了
        } else {
          // 失败了
        }
      },

      // 微信小程序还有两个回调，分别是fail和complete，success+fail=complete
      fail: function() {
        // 如果这个函数被调用了，那说明请求失败了
      }
    })
  }
})