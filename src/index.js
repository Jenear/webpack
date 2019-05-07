// import _ from "lodash";
// import printMe from "./print.js";
import "./style.css";
// function component() {
//   var element = document.createElement("div");
//   var btn = document.createElement("button");

//   //lodash now imported by this script
//   element.innerHTML = _.join(["Hello", "webpack"], " ");

//   btn.innerHTML = "Click me and check the console!";
//   btn.onclick = printMe;
//   element.appendChild(btn);

//   return element;
// }

// document.body.appendChild(component());
// if (module.hot) {
//   module.hot.accept("./print.js", function() {
//     console.log("Accepting the updated printMe module!");
//     printMe();
//   });
// }

// tree shaking
// tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。
// import { cube } from "./math.js";

// function component() {
//   var element = document.createElement("pre");

//   element.innerHTML = [
//     "Hello webpack!!!!!",
//     "5 cubed is equal to " + cube(5)
//   ].join("\n\n");

//   return element;
// }

// document.body.appendChild(component());

import _ from "lodash";
import React from "react";
// import ReactDOM from "react-dom";

function component() {
  let element = document.createElement("div");
  let button = document.createElement("button");
  let br = document.createElement("br");
  button.innerHTML = "Click me and look at the console!";
  element.appendChild(br);
  element.appendChild(button);
  // Note that because a network request is involved, some indication
  // of loading would need to be shown in a production-level site/app.
  button.onclick = e =>
    //运用import实现懒加载，名字用/* webpackChunkName: "print" */来实现，build打包结果是print.bundle.js
    import(/* webpackChunkName: "print" */ "./print").then(module => {
      let print = module.default;
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
      print();
    });
  return element;
}

document.body.appendChild(component());
