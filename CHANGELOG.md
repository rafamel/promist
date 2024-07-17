

# [6.0.0](https://github.com/rafamel/promist/compare/v4.0.0...v6.0.0) (2024-07-17)


### Bug Fixes

* remove external AbortController dependency ([36df93c](https://github.com/rafamel/promist/commit/36df93c7480d0886101510b974099f2df8ea3c97))
* update type-core dependency ([0e506d1](https://github.com/rafamel/promist/commit/0e506d1779f027faf152f243e02a6bf0b931dad2))


### chore

* reboot package development ([0a3d779](https://github.com/rafamel/promist/commit/0a3d779da8996cd6d92b5dd2e9b8b0fe28114a38))
* update setup ([e115067](https://github.com/rafamel/promist/commit/e115067522f3124ddab0252823694efe64e0cab1))


### Features

* **classes:** add CancellablePromise ([1aa340e](https://github.com/rafamel/promist/commit/1aa340ee9f3c374f3e2646ce9d1bde7b00b90742))
* **classes:** add DeferredPromise ([c24ad6b](https://github.com/rafamel/promist/commit/c24ad6bdef4907d01d042e4bc868f9b7ce6ad74c))
* **classes:** add ExtensiblePromise ([0166da2](https://github.com/rafamel/promist/commit/0166da2fe1548b814ed1cc55159481f9c71bdc7b))
* **classes:** add LazyPromise ([d9b5984](https://github.com/rafamel/promist/commit/d9b598467c31d7c1943afe0ca2c28b9288663775))
* **classes:** add SyncPromise ([e34ca8d](https://github.com/rafamel/promist/commit/e34ca8d0307fd257b8b2eaf7ac85a24058c5fcb9))
* **collection:** add Parallel ([2ed3bdf](https://github.com/rafamel/promist/commit/2ed3bdf7728e589891ebf246aab7e98b0bf4c668))
* **collection:** add Series methods ([87ca458](https://github.com/rafamel/promist/commit/87ca4589b825e373a9e0951cc5a74408ed3c8ba1))
* **creation:** add timeout ([17d3edb](https://github.com/rafamel/promist/commit/17d3edb958340e53bf53dae498443ab7336235b1))
* **creation:** add until ([8cc3dd2](https://github.com/rafamel/promist/commit/8cc3dd28e191c4870894880e8b5e3d85347fbbac))
* **creation:** add wait ([67b9da7](https://github.com/rafamel/promist/commit/67b9da749fa6b0a6ede8b55950443c4d0fd4e958))
* **creation:** wait can take a null delay for immediate resolution ([972968f](https://github.com/rafamel/promist/commit/972968ff47fc0c1b937167fa203cc40f0ada883b))
* **utils:** add control and type guards utils ([ec0cff2](https://github.com/rafamel/promist/commit/ec0cff272ce3896b82a18053f76f742fe0bd1ec0))


### BREAKING CHANGES

* isPromiseLike returns false for functions with a then method
* require node >= 22
* Promist has been almost entirely rewritten and its api redesigned. Please check the
latest documentation.

# [5.1.0](https://github.com/rafamel/promist/compare/v5.0.0...v5.1.0) (2021-12-14)


### Features

* **creation:** wait can take a null delay for immediate resolution ([972968f](https://github.com/rafamel/promist/commit/972968ff47fc0c1b937167fa203cc40f0ada883b))



# [5.0.0](https://github.com/rafamel/promist/compare/v4.0.0...v5.0.0) (2021-12-13)


### chore

* reboot package development ([0a3d779](https://github.com/rafamel/promist/commit/0a3d779da8996cd6d92b5dd2e9b8b0fe28114a38))


### Features

* **classes:** add CancellablePromise ([1aa340e](https://github.com/rafamel/promist/commit/1aa340ee9f3c374f3e2646ce9d1bde7b00b90742))
* **classes:** add DeferredPromise ([c24ad6b](https://github.com/rafamel/promist/commit/c24ad6bdef4907d01d042e4bc868f9b7ce6ad74c))
* **classes:** add ExtensiblePromise ([0166da2](https://github.com/rafamel/promist/commit/0166da2fe1548b814ed1cc55159481f9c71bdc7b))
* **classes:** add LazyPromise ([d9b5984](https://github.com/rafamel/promist/commit/d9b598467c31d7c1943afe0ca2c28b9288663775))
* **classes:** add SyncPromise ([e34ca8d](https://github.com/rafamel/promist/commit/e34ca8d0307fd257b8b2eaf7ac85a24058c5fcb9))
* **collection:** add Parallel ([2ed3bdf](https://github.com/rafamel/promist/commit/2ed3bdf7728e589891ebf246aab7e98b0bf4c668))
* **collection:** add Series methods ([87ca458](https://github.com/rafamel/promist/commit/87ca4589b825e373a9e0951cc5a74408ed3c8ba1))
* **creation:** add timeout ([17d3edb](https://github.com/rafamel/promist/commit/17d3edb958340e53bf53dae498443ab7336235b1))
* **creation:** add until ([8cc3dd2](https://github.com/rafamel/promist/commit/8cc3dd28e191c4870894880e8b5e3d85347fbbac))
* **creation:** add wait ([67b9da7](https://github.com/rafamel/promist/commit/67b9da749fa6b0a6ede8b55950443c4d0fd4e958))
* **utils:** add control and type guards utils ([ec0cff2](https://github.com/rafamel/promist/commit/ec0cff272ce3896b82a18053f76f742fe0bd1ec0))


### BREAKING CHANGES

* Promist has been almost entirely rewritten and its api redesigned. Please check the
latest documentation.



# [4.0.0](https://github.com/rafamel/promist/compare/v3.0.0...v4.0.0) (2020-08-05)


### Features

* **utils:** adds isPromiseLike ([8cb7af2](https://github.com/rafamel/promist/commit/8cb7af25c5746784cb746f799388a9002e24410e))


### BREAKING CHANGES

* **utils:** isPromise behavior is more restrictive and will return false for thenables; will
only return true for thenable and catchable objects



# [3.0.0](https://github.com/rafamel/promist/compare/v2.0.2...v3.0.0) (2020-04-13)


### Bug Fixes

* **utils:** declares control w/ more permissive types for Generator ([3703e94](https://github.com/rafamel/promist/commit/3703e94e0d5548dd1cc66fedefa3def02902ad3c))


### chore

* updates setup and dependencies ([a0454b4](https://github.com/rafamel/promist/commit/a0454b404e273713207e4317d2eada94f44ee27d))


### BREAKING CHANGES

* Requires node +12



## [2.0.2](https://github.com/rafamel/promist/compare/v2.0.1...v2.0.2) (2020-02-13)


### Bug Fixes

* fixes Promist value type inference for generics ([b87e128](https://github.com/rafamel/promist/commit/b87e1285b0b9e43845de23fb0ec9f5ac9847932f))



## [2.0.1](https://github.com/rafamel/promist/compare/v2.0.0...v2.0.1) (2020-02-13)


### Bug Fixes

* fixes subscribe type inference ([f232232](https://github.com/rafamel/promist/commit/f232232c4a7f328a629ea247817d64d214005637))



# [2.0.0](https://github.com/rafamel/promist/compare/v1.0.0...v2.0.0) (2019-10-31)


### Bug Fixes

* **classes:** fixes PromiseExecutor definition; fixes LazyPromist using PromiseExecutor instead of PromistExecutor ([3bed547](https://github.com/rafamel/promist/commit/3bed547f36944f2028f7fed6487d0350b2a3f851))
* exports classes and collections from main entry point ([55d7f19](https://github.com/rafamel/promist/commit/55d7f1992bd0bdec2a9c109b69ff1ec994b782f5))


* chore(prepares class based rewrite): ([a05e28d](https://github.com/rafamel/promist/commit/a05e28d9dd9672bd9eae601df4b31f4cd69347d5))


### Features

* **classes:** adds LazyPromist ([86808b8](https://github.com/rafamel/promist/commit/86808b864ada0b28201700ab4fe4903e96273bc0))
* **classes:** adds Promist ([ebec03c](https://github.com/rafamel/promist/commit/ebec03cda0c548cd093765455db602af4ec03e45))
* **create:** adds subscribe; renames waitUntil to until; reafactors until and wait ([aab4ea4](https://github.com/rafamel/promist/commit/aab4ea4319cc3044e3c52cb17c6c229d77d20dbe))
* subscribe and Promist.subscribe take a second onComplete argument ([128dd31](https://github.com/rafamel/promist/commit/128dd313e73b6ebc60788a4283099518689f54e1))


### BREAKING CHANGES

* **create:** waitUntil has been renamed to until; takes ms as a third parameter instead of as
second; most other create functions have been removed
* All extend functions have been deprecated, some of the previous create function
remain, perhaps with different apis, while some other have been added. The pipe and clone utilities
have also been deprecated.



# [1.0.0](https://github.com/rafamel/promist/compare/v0.7.0...v1.0.0) (2019-10-02)


### Bug Fixes

* **utils/control:** updates to latest typscript (Generator) ([798dbb0](https://github.com/rafamel/promist/commit/798dbb0df674fc7855aa42e830dfebab72848ea7))


### Code Refactoring

* **extend:** renames status to stateful ([54bdef6](https://github.com/rafamel/promist/commit/54bdef61b7288ae19fda31e22cd0e1a3562b5844))


### Features

* **create/deferred:** guards agains unassigned values for resolve and reject ([b19294c](https://github.com/rafamel/promist/commit/b19294c091531758219ca1792c1cc4b688f00bba))
* **create:** removes immediate ([0872f71](https://github.com/rafamel/promist/commit/0872f713d88e10d4ed8333b24bb205428922c23b))
* **extend/timeout:** doesn't declare return type as an extended promise ([c87ff5f](https://github.com/rafamel/promist/commit/c87ff5fd480ede631297c05d416068acce781506))
* improves typings; extend functions clone input promise ([71fb681](https://github.com/rafamel/promist/commit/71fb6818a5525f767b61590ed7d1a18853239326))
* **utils:** adds isPromist ([c52e6e4](https://github.com/rafamel/promist/commit/c52e6e4e12b68eefb2bf8eb8b2809ee97b4afdca))
* **utils:** exports clone as an util ([7a738be](https://github.com/rafamel/promist/commit/7a738be081fd7f5628883130a088ccb3aa0d5f6e))
* **utils:** replaces compose with pipe ([4905d84](https://github.com/rafamel/promist/commit/4905d8419d27b4639328e2124e2dba06eeeb5186))


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

* **create/lazy:** adds lazy.fn ([5212948](https://github.com/rafamel/promist/commit/5212948eec183de81d8bb30029067df3270a0a68))



# [0.6.0](https://github.com/rafamel/promist/compare/v0.5.3...v0.6.0) (2019-05-12)


### Features

* **compose:** adds second argument (create) for compose functions ([344fcd7](https://github.com/rafamel/promist/commit/344fcd715eab46917b613c5755b3a9d426b1e8e2))
* exports types from entry point ([a47f043](https://github.com/rafamel/promist/commit/a47f043eb9b9989fffab5a09471676b3dcf0aeab))
* **helpers:** adds asNew() ([e5921c6](https://github.com/rafamel/promist/commit/e5921c6c73275845b984993280616c5105389389))
* **helpers:** adds helpers index w/ named exports ([20c433c](https://github.com/rafamel/promist/commit/20c433cb5c31ba73a05707309ba3310199f0ddbf))
* **types:** defines statuses as literals instead of enums ([c6e9c50](https://github.com/rafamel/promist/commit/c6e9c500befcba8cc80664c625e721ca6fa58621))
* **utils/compose:** adds create argument to compose; improves typings ([a051a63](https://github.com/rafamel/promist/commit/a051a6325a1dbcc0094823005215ad27f0428a32))
* **utils/is-promise:** adds type guard to isPromise ([70d3e62](https://github.com/rafamel/promist/commit/70d3e62b196cc58f0e566a6f80ed5f8da561231c))



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
