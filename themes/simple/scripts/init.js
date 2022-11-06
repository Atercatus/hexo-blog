require('./import-primer');
const sass = require('node-sass');

// hexo-render 참조: https://hexo.io/ko/api/renderer.html
const renderer = ({ text, path }, option) => {
  // sass 옵션 참조: https://www.npmjs.com/package/node-sass
  const result = sass.renderSync({
    data: text,
    file: path,
    includePaths: ['node_modules'], // 2022.11.06: @primer/css import 를 하기 위함
  });

  return result.css.toString();
};

// arg1: 입력 파일의 확장자
// arg2: 출력 파일의 확장자
// arg4: 동기
hexo.extend.renderer.register('scss', 'css', renderer, true);
