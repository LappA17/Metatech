({
    doSomething(a, b) {
        console.log({ a, b })
    },
    async doSomethingElse(name) {
        console.log({ name })
    }
    collection: new Map()
})
/*
    Допустим мы хотим писать модули вот в таком синтаксисе, который отличает от экмаскрипт модулей и коммон жс 
*/