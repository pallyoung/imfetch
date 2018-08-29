const fetch = require('./../index');

it('fetch test',function(){
  fetch('https://www.baidu.com').then(response=>{
    response.text().then(function(text){
      expect(text).not.toBeFalsy()
    })
  })
})