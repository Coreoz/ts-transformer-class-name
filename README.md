ts-transformer-class-name
=========================

A typescript transformer that attaches the class name to each class type.
It enables to recover the class name after a JS minimizer has been executed to the code base.

So for example if you have the class:
```typescript
class MyClass {
  // class implementation...
}
```
After the transformer has been executed, you should have:
```typescript
MyClass[CONSTRUCTOR_NAME_SYMBOL] === 'MyClass'
```

Usage
-----

[ttypescript](https://github.com/cevek/ttypescript) can be used to integrate this transformer.
After ttypescript is installed, you can reference the transformer in your `tsconfig.json` file:
```json
{
    "compilerOptions": {
        "plugins": [
          { "transform": "ts-transformer-classname", "import": "classNameTransformer" }
        ]
    }
}
```

DI Compiler adapter
-------------------
The adapter for DI [Compiler](https://github.com/wessberg/DI-compiler) is now provided. To use it:
```json
{
    "compilerOptions": {
        "plugins": [
          { "transform": "ts-transformer-classname", "import": "diTransformerAdapter" }
        ]
    }
}
```

Release process
---------------
Run `yarn release`
