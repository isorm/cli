import { Injectable } from "isorm-core";

@Injectable
class MainService {
  sayHello() {
    return `<div style="font-weight: bold;background: #0a0a0a;color: #e5e5e5;font-size: 2rem;direction: rtl;display: flex;font-family: monospace;align-items: center;justify-content: center;position: fixed;left: 0;top: 0;height: 100%;width: 100%;">
    Hello Isorm 👋
        </div>`
  }
}

export default MainService;
