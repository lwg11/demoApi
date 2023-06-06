# demoApi
node后台demo


数据库导出文件导入报错原因：
在此修改后的语句中，我将“utf8mb4_0900_ai_ci”替换为“utf8mb4_general_ci”作为字符列的排序规则。



API文档生成工具apicdoc是一个基于注释生成API文档的工具，使用它可以方便地生成API文档。下面是使用apicdoc的步骤：

1. 安装apicdoc

你可以在命令行中运行以下命令进行安装：

```
npm install apidoc -g
```

注释生成：
apidoc根据注释生成文档，这就需要我们有好的注释规范。
vscode有一个注释插件可以更方便的生成注释：ApiDoc Snippets

常用的关键字

@apiVersion verison
  接口版本，major.minor.patch的形式
@api {method} path [title]
  只有使用@api标注的注释块才会在解析之后生成文档，title会被解析为导航菜单(@apiGroup)下的小菜单
  method如{POST GET}
@apiGroup name
  分组名称，被解析为导航栏菜单
@apiName name
  接口名称，在同一个@apiGroup下，名称相同的@api通过@apiVersion区分，否者后面@api会覆盖前面定义的@api
@apiDescription text
  接口描述，支持html语法
  
@apiIgnore [hint]
  apidoc会忽略使用@apiIgnore标注的接口，hint为描述
@apiSampleRequest url
  接口测试地址以供测试，发送请求时，@api method必须为POST/GET等其中一种
 
@apiDefine name [title] [description]
  定义一个注释块(不包含@api)，配合@apiUse使用可以引入注释块
  在@apiDefine内部不可以使用@apiUse
@apiUse name
  引入一个@apiDefine的注释块
 
@apiParam [(group)] [{type}] [field=defaultValue] [description]
@apiHeader [(group)] [{type}] [field=defaultValue] [description]
@apiError [(group)] [{type}] field [description]
@apiSuccess [(group)] [{type}] field [description]
  用法基本类似，分别描述请求参数、头部，响应错误和成功
  group表示参数的分组，type表示类型(不能有空格)，入参可以定义默认值(不能有空格)
@apiParamExample [{type}] [title] example
@apiHeaderExample [{type}] [title] example
@apiErrorExample [{type}] [title] example
@apiSuccessExample [{type}] [title] example
  用法完全一致，但是type表示的是example的语言类型
  example书写成什么样就会解析成什么样，所以最好是书写的时候注意格式化，(许多编辑器都有列模式，可以使用列模式快速对代码添加*号)
  
@apiPermission name
  name必须独一无二，描述@api的访问权限，如admin/anyone





生成文档命令
apidoc -i .\src\routes\ -o .\doc


    "doc": "apidoc -i src/routes/ -o doc/"


"apidoc": "apidoc -i ./src/routes/ -o ./doc"
因为命令很长，已经在package.json封装了，启动命令如下：
yarn apidoc