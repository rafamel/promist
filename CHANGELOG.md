## [2.0.1](https://github.com/rafamel/promist/compare/v2.0.0...v2.0.1) (2020-02-13)


### Bug Fixes

* fixes subscribe type inference ([f232232](https://github.com/rafamel/promist/commit/f232232c4a7f328a629ea247817d64d214005637))



# [2.0.0](https://github.com/rafamel/promist/compare/v1.0.0...v2.0.0) (2019-10-31)


* chore(prepares class based rewrite): ([a05e28d](https://github.com/rafamel/promist/commit/a05e28d))


### Bug Fixes

* exports classes and collections from main entry point ([55d7f19](https://github.com/rafamel/promist/commit/55d7f19))
* **classes:** fixes PromiseExecutor definition; fixes LazyPromist using PromiseExecutor instead of PromistExecutor ([3bed547](https://github.com/rafamel/promist/commit/3bed547))


### Features

* **classes:** adds LazyPromist ([86808b8](https://github.com/rafamel/promist/commit/86808b8))
* **classes:** adds Promist ([ebec03c](https://github.com/rafamel/promist/commit/ebec03c))
* **create:** adds subscribe; renames waitUntil to until; reafactors until and wait ([aab4ea4](https://github.com/rafamel/promist/commit/aab4ea4))
* subscribe and Promist.subscribe take a second onComplete argument ([128dd31](https://github.com/rafamel/promist/commit/128dd31))


### BREAKING CHANGES

* **create:** waitUntil has been renamed to until; takes ms as a third parameter instead of as
second; most other create functions have been removed
* All extend functions have been deprecated, some of the previous create function
remain, perhaps with different apis, while some other have been added. The pipe and clone utilities
have also been deprecated.



# [1.0.0](https://github.com/rafamel/promist/compare/v0.7.0...v1.0.0) (2019-10-02)


### Bug Fixes

* **utils/control:** updates to latest typscript (Generator) ([798dbb0](https://github.com/rafamel/promist/commit/798dbb0))


### Code Refactoring

* **extend:** renames status to stateful ([54bdef6](https://github.com/rafamel/promist/commit/54bdef6))


### Features

* **create:** removes immediate ([0872f71](https://github.com/rafamel/promist/commit/0872f71))
* **create/deferred:** guards agains unassigned values for resolve and reject ([b19294c](https://github.com/rafamel/promist/commit/b19294c))
* improves typings; extend functions clone input promise ([71fb681](https://github.com/rafamel/promist/commit/71fb681))
* **extend/timeout:** doesn't declare return type as an extended promise ([c87ff5f](https://github.com/rafamel/promist/commit/c87ff5f))
* **utils:** adds isPromist ([c52e6e4](https://github.com/rafamel/promist/commit/c52e6e4))
* **utils:** exports clone as an util ([7a738be](https://github.com/rafamel/promist/commit/7a738be))
* **utils:** replaces compose with pipe ([4905d84](https://github.com/rafamel/promist/commit/4905d84))


### BREAKING CHANGES

* Typing improvements might break typescript codebases; extend functions clone the
input promises, returning a new promise instance, which will break all usage relying on object
mutation; extend functions don't take a second argument (previously used for returning a new promise
instance instead of mutating the object)
* **extend:** The `state` extend function -with its associated type- has been renamed `stateful`
* **create:** Removes `immediate` create function, as it's entirely dispensable; it additionally
relied on non-standard features
* **utils:** The `compose` utility function has been replaced for `pipe` in order to preserve
type safety
* **utils/control:** latest TypeScript is required to get correct typings on control function



# [0.7.0](https://github.com/rafamel/promist/compare/v0.6.0...v0.7.0) (2019-05-13)


### Features

* **create/lazy:** adds lazy.fn ([5212948](https://github.com/rafamel/promist/commit/5212948))



# [0.6.0](https://github.com/rafamel/promist/compare/v0.5.3...v0.6.0) (2019-05-12)


### Features

* **compose:** adds second argument (create) for compose functions ([344fcd7](https://github.com/rafamel/promist/commit/344fcd7))
* **helpers:** adds asNew() ([e5921c6](https://github.com/rafamel/promist/commit/e5921c6))
* **helpers:** adds helpers index w/ named exports ([20c433c](https://github.com/rafamel/promist/commit/20c433c))
* **types:** defines statuses as literals instead of enums ([c6e9c50](https://github.com/rafamel/promist/commit/c6e9c50))
* exports types from entry point ([a47f043](https://github.com/rafamel/promist/commit/a47f043))
* **utils/compose:** adds create argument to compose; improves typings ([a051a63](https://github.com/rafamel/promist/commit/a051a63))
* **utils/is-promise:** adds type guard to isPromise ([70d3e62](https://github.com/rafamel/promist/commit/70d3e62))



## [0.5.3](https://github.com/rafamel/promist/compare/v0.5.2...v0.5.3) (2019-02-24)



## [0.5.2](https://github.com/rafamel/promist/compare/v0.5.1...v0.5.2) (2019-01-24)



## [0.5.1](https://github.com/rafamel/promist/compare/v0.5.0...v0.5.1) (2019-01-20)



# [0.5.0](https://github.com/rafamel/promist/compare/v0.4.3...v0.5.0) (2019-01-19)



## [0.4.3](https://github.com/rafamel/promist/compare/v0.4.2...v0.4.3) (2019-01-15)



## [0.4.2](https://github.com/rafamel/promist/compare/v0.4.1...v0.4.2) (2019-01-07)



## [0.4.1](https://github.com/rafamel/promist/compare/v0.4.0...v0.4.1) (2019-01-07)



# [0.4.0](https://github.com/rafamel/promist/compare/v0.3.1...v0.4.0) (2019-01-07)



## [0.3.1](https://github.com/rafamel/promist/compare/v0.3.0...v0.3.1) (2018-12-31)



# [0.3.0](https://github.com/rafamel/promist/compare/v0.2.0...v0.3.0) (2018-12-31)



# [0.2.0](https://github.com/rafamel/promist/compare/v0.1.3...v0.2.0) (2018-12-18)



## [0.1.3](https://github.com/rafamel/promist/compare/v0.1.2...v0.1.3) (2018-12-10)



## [0.1.2](https://github.com/rafamel/promist/compare/v0.1.1...v0.1.2) (2018-12-08)



## [0.1.1](https://github.com/rafamel/promist/compare/v0.1.0...v0.1.1) (2018-12-07)



# 0.1.0 (2018-12-06)


