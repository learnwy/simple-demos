import {add as initAdd} from "./add";

export * from './sub'
export * from './mul'
export * from './div'
export let add = initAdd

export function changeAdd() {
    add = (num1: number, num2: number): number => {
        console.log('changed add')
        return num2 + num1
    }
}
